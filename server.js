const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { generateRandomCode, saveToDB, hashPassword, renderStaticFile, parseRequestBody, getSessionId, isValidHttpUrl } = require('./utils');
const { renderInvalidHTML, renderAliasExistsHTML, renderShortenedURLHTML } = require('./views');

const BASE_URL = 'http://localhost:3000';
const mySessions = {};

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

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    return renderStaticFile(path.join(__dirname, 'public', 'index.html'), 'text/html', res);
  }

  if (req.url === '/register' && req.method === 'GET') {
    return renderStaticFile(path.join(__dirname, 'public', 'register.html'), 'text/html', res);
  }

  if (req.url === '/login.css' && req.method === 'GET') {
    return renderStaticFile(path.join(__dirname, 'public', 'login.css'), 'text/css', res);
  }

  if (req.url === '/index.css' && req.method === 'GET') {
    return renderStaticFile(path.join(__dirname, 'public', 'index.css'), 'text/css', res);
  }

  if (req.url === '/register.css' && req.method === 'GET') {
    return renderStaticFile(path.join(__dirname, 'public', 'register.css'), 'text/css', res);
  }

  if (req.url === '/login' && req.method === 'GET') {
    return renderStaticFile(path.join(__dirname, 'public', 'login.html'), 'text/html', res);
  }

  if (req.url === '/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    parseRequestBody(req).then(params => {
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
      saveToDB(dataFile, myDataBase);

      res.writeHead(301, { Location: `${BASE_URL}/login` }).end();
    });
    return;
  }

  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    parseRequestBody(req).then(params => {
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

  if (req.url === '/logout' && req.method === 'POST') {
    const sessionId = getSessionId(req);

    if (sessionId && mySessions[sessionId]) {
      delete mySessions[sessionId];
    }

    // Clear cookie by setting expiry in the past
    res.writeHead(301, {
      'Set-Cookie': 'sessionId=; Path=/; Max-Age=0',
      'Location': BASE_URL
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/shorten') {
    let body = '';
    req.on('data', chunk => body += chunk);
    parseRequestBody(req).then(params => {
      const cookies = req.headers.cookie;
      const originalUrl = params.get('originalUrl');

      if (!isValidHttpUrl(originalUrl)) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        return res.end(renderInvalidHTML());
      }

      let shortCode = generateRandomCode();
      if (cookies) {
        const alias = params.get('alias'); 
        if(myDataBase[alias]) {
          res.end(renderAliasExistsHTML());
          return;
        }
        shortCode = alias;
      }
      myDataBase[shortCode] = originalUrl;
      saveToDB(dataFile, myDataBase);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderShortenedURLHTML(shortCode, BASE_URL));

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
