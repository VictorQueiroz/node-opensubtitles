# node-opensubtitles

An open source library to help you to download and search subtitles through the OpenSubtitles API.

### Installation
```
npm install --save node-opensubtitles
```

### Usage
```js
var Os = require('node-opensubtitles');

var os = new Os({
	useragent: process.env.MY_USER_AGENT
});

os.LogIn(process.env.USERNAME, process.env.PASSWORD).then(function (res) {
	console.log(res);
});

os.SearchSubtitles([{
	query: 'breaking bad',
	sublanguageid: 'por',
	episode: 1,
	season: 1
}]).then(function (value) {
	console.log(value.data);
});

os.search([{
	query: 'breaking bad',
	episode: 1,
	season: 1,
	sublanguageid: 'por'
}]).then(function (value) {
	return os.download(value.map(function (value) {
		return value.IDSubtitleFile;
	}));
}).then(function (subtitles) {
	return Q.all(subtitles.map(function (buf, index) {
		return buf.save('./my-sub-' + index + '.srt');
	}));
});
```

### API
- os.search
	- Return an array, with the results.

- os.download
	- Return an array of buffers, already base64 decoded and ready to save