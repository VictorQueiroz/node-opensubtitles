var Os = require('../index');
var os = new Os();
var fs = require('fs');
var zlib = require('zlib');
var should = require('should');

describe('node-opensubtitles', function () {
	it('should authenticate', function (done) {
		os.LogIn().then(function (res) {
			done();
		});
	});

	it('should search for subtitles', function (done) {
		this.timeout(99999);

		os.SearchSubtitles([{
			query: 'breaking bad',
			sublanguageid: 'por',
			episode: 1,
			season: 1
		}]).then(function (value) {
			value[0].should.have.property('SubFileName');
			done();
		});
	});

	it('should list available translations', function (done) {
		this.timeout(99999);

		os.GetAvailableTranslations().then(function (translations) {
			done();
		});
	});

	it('should download subtitles by direct method', function (done) {
		this.timeout(99999);
		os.search([{
			query: 'breaking bad',
			episode: 1,
			season: 1,
			sublanguageid: 'por'
		}]).then(function (value) {
			return value[0].download('./test').then(function () {
				done();
			});
		}, function (err) {
			console.log(err);
			done(err);
		});
	});

	it('should download subtitles using the opensubtitles api directly', function (done) {
		this.timeout(99999);
		os.search([{
			query: 'breaking bad',
			episode: 1,
			season: 1,
			sublanguageid: 'por'
		}]).then(function (value) {
			return os.download([value[0].IDSubtitleFile]);
		}).then(function (r) {
			r[0].save('./test/my-sub.srt').then(function () {
				fs.existsSync('./test/my-sub.srt').should.be.exactly(true);
				done();
			})
		}, function (err) {
			console.log(err);
			done(err);
		});
	});
});