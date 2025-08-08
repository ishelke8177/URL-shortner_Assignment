const fs = require('fs');
const crypto = require('crypto');

function generateRandomCode() {
  return Math.random().toString(36).substring(2, 8);
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const params = new URLSearchParams(body);
        resolve(params);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name.trim();
    const value = rest.join('=').trim();
    if (name && value) {
      list[name] = decodeURIComponent(value);
    }
  });

  return list;
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function saveToDB(dataFile, myDataBase) {
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

function getSessionId(req) {
  const cookies = parseCookies(req);
  return cookies.sessionId;
}

function isValidHttpUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = {
  generateRandomCode,
  renderStaticFile,
  parseRequestBody,
  isValidHttpUrl,
  parseCookies,
  hashPassword,
  getSessionId,
  saveToDB,
};
