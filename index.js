var _ = require('lodash');
var Q = require('q');
var xmlrpc = require('xmlrpc');

function Os (options) {
	this.useragent = 'OSTestUserAgent';
	this.client = xmlrpc.createClient('http://api.opensubtitles.org/xml-rpc');
	
	_.extend(this, options);
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
	}
});

_.extend(Os.prototype, {
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

		return this.method('SearchSubtitles', args);
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