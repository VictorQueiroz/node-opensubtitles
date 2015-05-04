var _ = require('lodash');
var Q = require('q');
var fs = require('fs');
var path = require('path');
var http = require('http');
var zlib = require('zlib');

function Subtitle (attributes) {
	_.merge(this, attributes);
}

_.extend(Subtitle.prototype, {
	download: function (destPath) {
		var deferred = Q.defer();
		var dest;

		destPath = path.join(destPath, this.SubFileName);

		http.get(this.SubDownloadLink, function (response) {
			var gunzip = zlib.createGunzip();

			dest = fs.createWriteStream(destPath);

			response.pipe(gunzip).pipe(dest);

			dest.on('close', function () {
				response.unpipe(gunzip);
				response.unpipe(dest);

				deferred.resolve(dest);
			});

			dest.on('error', function (error) {
				deferred.reject(error);
			});
		});

		return deferred.promise;
	}
});

module.exports = Subtitle;