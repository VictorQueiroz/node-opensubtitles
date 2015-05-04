var should = require('should');
var Os = require('../index');
var os = new Os();

describe('node-opensubtitles', function () {
	it('should authenticate', function (done) {
		os.LogIn().then(function (res) {
			done();
		});
	});

	it('should search for subtitles', function (done) {
		this.timeout(9999);

		os.SearchSubtitles([{
			query: 'breaking bad',
			sublanguageid: 'por',
			episode: 1,
			season: 1
		}]).then(function (value) {
			value.should.be.an.Object;
			done();
		});
	});

	it('should list available translations', function (done) {
		this.timeout(9999);

		os.GetAvailableTranslations().then(function (translations) {
			done();
		});
	});

	it('should check sub hash', function (done) {
		this.timeout(9999);
		os.SearchSubtitles([{
			query: 'breaking bad',
			episode: 1,
			season: 1
		}]).then(function (value) {
			value.data.	should.be.an.Object;
			done();
		})
	});
});