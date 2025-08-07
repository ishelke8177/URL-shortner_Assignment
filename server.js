const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3000';
const mySessions = {};

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

  if (req.url === '/login' && req.method === 'GET') {
    return renderStaticFile(path.join(__dirname, 'public', 'login.html'), 'text/html', res);
  }

  if (req.url === '/register' && req.method === 'POST') {
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

      res.writeHead(301, { Location: `${BASE_URL}/login` }).end();
    });
    return;
  }

  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const username = params.get('username');
      const password = params.get('password');

      const user = myDataBase[username];
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        return res.end('User not found.');
      }

      const hashedPassword = hashPassword(password + user.salt);
      if (hashedPassword !== user.hashedPassword) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        return res.end('Incorrect password.');
      }

      const sessionId = crypto.randomUUID();
      mySessions[sessionId] = { username };

      console.log('Session created:', mySessions);

      res.writeHead(301, {
        'Set-Cookie': `sessionId=${sessionId};`,
        Location: BASE_URL,
      }).end();
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/shorten') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const cookies = req.headers.cookie;

      const params = new URLSearchParams(body);
      const originalUrl = params.get('originalUrl');

      if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Invalid URL');
      }

      let shortCode = generateRandomCode();
      if (cookies) {
        const alias = params.get('alias'); 
        if(myDataBase[alias]) {
          res.end(`
            <p>URL alias already exists...</p>
            <a href="/">Try with another alias</a>
          `);
          return;
        }
        shortCode = alias;
      }
      myDataBase[shortCode] = originalUrl;
      saveToDB();

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <p>Short URL created:</p>
        <a href="/${shortCode}">${BASE_URL}/${shortCode}</a><br><br>
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
  console.log(`URL Shortener running at ${BASE_URL}`);
});
