const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

let myDataBase = {};
// Load existing mappings from file
const dataFile = path.join(__dirname, 'urlData.json');
if (fs.existsSync(dataFile)) {
  const data = fs.readFileSync(dataFile);
  try {
    myDataBase = JSON.parse(data);
  } catch (err) {
    console.error("Failed to parse urlData.json:", err);
  }
}

function generateRandomCode() {
  return Math.random().toString(36).substring(2, 8);
}

function saveToDB() {
  fs.writeFileSync(dataFile, JSON.stringify(myDataBase, null, 2));
}

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

  if (req.url === '/register' && req.method === 'GET') {
    return renderStaticFile(path.join(__dirname, 'public', 'register.html'), 'text/html', res);
  }

  if (req.url === '/register' && req.method === 'POST') {
    console.log('Received registration request');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const username = params.get('username');
      const password = params.get('password');

      if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Username and password are required');
      }

      if (myDataBase[username]) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Username already exists.');
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = hashPassword(password + salt);

      myDataBase[username] = { hashedPassword, salt };
      saveToDB();

      res.writeHead(301, { Location: 'http://localhost:3000' }).end();
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/shorten') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const originalUrl = params.get('originalUrl');

      if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Invalid URL');
      }

      const shortCode = generateRandomCode();
      myDataBase[shortCode] = originalUrl;
      saveToDB();

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <p>Short URL created:</p>
        <a href="/${shortCode}">http://localhost:3000/${shortCode}</a><br><br>
        <a href="/">Shorten another</a>
      `);
    });
    return;
  }

  // Handle redirect for short URLs
  if (req.method === 'GET') {
    const shortCode = req.url.slice(1);
    const originalUrl = myDataBase[shortCode];

    if (originalUrl) {
      res.writeHead(302, { 'Location': originalUrl });
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Short URL not found');
    }
    return;
  }

});

// Start the server
server.listen(3000, () => {
  console.log('URL Shortener running at http://localhost:3000');
});
