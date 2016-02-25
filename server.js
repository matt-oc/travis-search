const http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var formidable = require("formidable");

var mimeTypes = {
  'html' : "text.html",
  'jpeg' : "image/jpeg",
  'jpg' : 'image/jpeg',
  'png' : 'image/png',
  'js' : 'text/javascript',
  'css' : 'text/css'

};

// Create server
var server = http.createServer(function(req,res){
  var uri = url.parse(req.url).pathname;
  // gets filename
  var fileName = path.join(process.cwd(),unescape(uri)); //.cwd returns current working directory of process
console.log('Loading' + uri);
var stats;

try{
  stats = fs.lstatSync(fileName);
} catch(e) {
  res.writeHead(404, {'Content-type': 'text/plain'});
  res.write('404 Not Found/n');
  res.end();
  return;
}

//Check if file/directory
if (stats.isFile()){
  var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
  res.writeHead(200, {'Content-type' : mimeType});

  var fileStream = fs.createReadStream(fileName);
  fileStream.pipe(res);
}

  else if (stats.isDirectory()){
    res.writeHead(302,{'Location' : 'index.html'});
  }
  else{
    res.writeHead(500, {'Content-type': 'text/plain'});
    res.write('500 internal error');
    res.end();
  }

  function displayForm(res) {
      fs.readFile('index.html', function (err, data) {
          res.writeHead(200, {
              'Content-Type': 'text/html',
                  'Content-Length': data.length
          });
          res.write(data);
          res.end();
      });
  }
})

server.listen(3000);
console.log("Server starting.... listening on port 3000");
