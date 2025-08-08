const assert = require('assert');
const { Readable } = require('stream');
const utils = require('../utils');

// Test generateRandomCode
const code = utils.generateRandomCode();
assert.strictEqual(typeof code, 'string');
assert(code.length > 0);

// Test hashPassword consistency
const hash1 = utils.hashPassword('password123');
const hash2 = utils.hashPassword('password123');
assert.strictEqual(hash1, hash2);

// Test isValidHttpUrl
assert.strictEqual(utils.isValidHttpUrl('http://example.com'), true);
assert.strictEqual(utils.isValidHttpUrl('https://example.com'), true);
assert.strictEqual(utils.isValidHttpUrl('ftp://example.com'), false);
assert.strictEqual(utils.isValidHttpUrl('invalid-url'), false);

// Test parseCookies
const reqWithCookie = { headers: { cookie: 'sessionId=abc123; user=ishwar' } };
const cookies = utils.parseCookies(reqWithCookie);
assert.deepStrictEqual(cookies, { sessionId: 'abc123', user: 'ishwar' });

// Test getSessionId
assert.strictEqual(utils.getSessionId(reqWithCookie), 'abc123');

// Test parseRequestBody with a simulated request
const mockRequest = new Readable();
mockRequest.headers = {};
mockRequest.push('username=ishwar&password=secret');
mockRequest.push(null); // Signal end of stream

utils.parseRequestBody(mockRequest).then(params => {
  assert.strictEqual(params.get('username'), 'ishwar');
  assert.strictEqual(params.get('password'), 'secret');
  console.log('All tests passed ✅');
}).catch(err => {
  console.error('Error in parseRequestBody test:', err);
});

