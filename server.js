// from https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

const http = require('http'),
      fs = require('fs'),
      path = require('path');

http.createServer((req, res) => {
  console.log('request =>', req.url);

  let filePath = '.' + req.url;
  if (filePath == './') filePath = './index.html';

  let extname = String(path.extname(filePath)).toLowerCase(),
      contentType = 'text/html';
      mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
      };

  contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(200, {'Content-Type': contentType});
        res.end(content, 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        res.end();
      }
    } else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(content, 'utf-8');
    }
  });
}).listen(9000);
console.log('Server running at http://localhost:9000/');
