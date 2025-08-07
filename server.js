const http = require('http');
const fs = require('fs');
const path = require('path');

function renderStaticFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    return renderStaticFile(path.join(__dirname, 'public', 'index.html'), 'text/html', res);
  }
});

// Start the server
server.listen(3000, () => {
  console.log('URL Shortener running at http://localhost:3000');
});
