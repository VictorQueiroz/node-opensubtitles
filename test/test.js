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
		this.timeout(99999);

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
		this.timeout(99999);

		os.GetAvailableTranslations().then(function (translations) {
			done();
		});
	});

	it('should download subtitles', function (done) {
		this.timeout(99999);
		os.search([{
			query: 'breaking bad',
			episode: 1,
			season: 1,
			sublanguageid: 'por'
		}]).then(function (value) {
			value.data[0].should.have.property('IDSubtitleFile');

			return os.download([value.data[0].IDSubtitleFile, value.data[1].IDSubtitleFile]).then(function (data) {
				console.log(data.toString('utf8'));
				done();
			});
		});
	});
});