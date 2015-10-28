
var fs = require('fs');

fs.readFile('certs/usr.key', function(err, data){
	var sData = data.toString('ascii', 0, data.length)
	console.log(sData);
});

var data = fs.readFileSync('certs/usr.crt');
var sData = data.toString('ascii', 0, data.length);
console.log(sData);
