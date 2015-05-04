var _ = require('lodash');
var Q = require('q');
var fs = require('fs');
var zlib = require('zlib');
var temp = require('temp');
var xmlrpc = require('xmlrpc');
var Subtitle = require('./subtitle');

function gunzip (buf) {
	var deferred = Q.defer();
	zlib.gunzip(buf, function (err, buf) {
		if(err) {
			return deferred.reject(err);
		}

		deferred.resolve(buf);
	});
	return deferred.promise;
}

function writeFile (filename, data, options) {
	var deferred = Q.defer();
	fs.writeFile(filename, data, options, function (err) {
		if(err) {
			return deferred.reject(err);
		}
		deferred.resolve();
	});
	return deferred.promise;
}

function Os (options) {
	this.useragent = 'OSTestUserAgent';
	this.endpoint = 'http://api.opensubtitles.org/xml-rpc';
	this.client = xmlrpc.createClient(this.endpoint);
	
	_.extend(this, options, {
		download: this.DownloadSubtitles,
		search: this.SearchSubtitles
	});
}

_.extend(Os.prototype, {
	method: function (methodName) {
		var deferred = Q.defer();
		var args = Array.prototype.slice.apply(arguments, [1])[0];

		this.client.methodCall(methodName, args, function (error, value) {
			if(error) {
				return deferred.reject(error);
			}

			deferred.resolve(value);
		});

		return deferred.promise;
	},	
	DownloadSubtitles: function (args) {
		if(!_.isArray(_.toArray(arguments)[0])) {
			args = _.toArray(arguments);
		}

		if(_.isArray(args) && _.isUndefined(args[0])) {
			args = args;
		}

		args = [args];

		if(!_.isUndefined(this.token)) {
			args.unshift(this.token);
		}

		return this.method('DownloadSubtitles', args).then(function (value) {
			return Q.all(value.data.map(function (value) {
				return gunzip(new Buffer(value.data, 'base64')).then(function (buf) {
					return _.extend(buf, {
						save: function (filename, options) {
							return writeFile(filename, buf, options);
						}
					});
				});
			}));
		});
	},
	GetAvailableTranslations: function (token, program) {
		var args = {};

		if(_.isUndefined(token)) {
			token = this.token;
		}

		args.token = token;
		args = _.toArray(args);

		return this.method('GetAvailableTranslations', args);
	},
	SearchSubtitles: function () {
		args = _.toArray(arguments);

		args.unshift(this.token);

		return this.method('SearchSubtitles', args).then(function (value) {
			return value.data.map(function (subtitle) {
				return new Subtitle(subtitle);
			});
		});
	},
	LogIn: function (username, password, language, useragent) {
		var self = this;
		var args = {
			username: username,
			password: password,
			language: language
		};

		if(_.isUndefined(useragent)) {
			args.useragent = this.useragent;
		}

		args = _.toArray(args);

		return this.method('LogIn', args).then(function (value) {
			self.token = value.token;

			return value;
		});
	}
});

module.exports = Os;