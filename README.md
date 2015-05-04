# node-opensubtitles

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
```