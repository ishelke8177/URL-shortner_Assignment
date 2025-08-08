function renderInvalidHTML() {
  return (`
        <div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(to right, #ff416c, #ff4b2b); color: #fff; padding: 60px; text-align: center; height: 100vh;">
          <div style="background: #fff; color: #333; display: inline-block; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
            <h2 style="margin-top: 0; color: #ff4d4f;">Invalid URL</h2>
            <p style="font-size: 18px;">The URL you entered is not valid. Please include "http://" or "https://".</p>
            <a href="/" style="display: inline-block; background-color: #ff4b2b; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">Try Again</a>
          </div>
        </div>
   `);
}

function renderAliasExistsHTML() {
    return (`
        <div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(to right, #4facfe, #00f2fe); color: #fff; padding: 40px; text-align: center; height: 100vh;">
            <div style="background: #fff; color: #333; display: inline-block; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                <h2 style="margin-top: 0; color: #ff4d4f;">Alias Already Exists</h2>
                <p style="font-size: 18px;">The URL alias you entered is already taken. Please try another one.</p>
                <a href="/" style="display: inline-block; background-color: #4facfe; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">Try Another Alias</a>
            </div>
        </div>
    `);
}

function renderShortenedURLHTML(shortCode, BASE_URL) {
    return  (`
        <div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(to right, #4facfe, #00f2fe); color: #fff; padding: 60px; text-align: center; height: 100vh;">
          <div style="background: #fff; color: #333; display: inline-block; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
            <h2 style="margin-top: 0;">Short URL Created!</h2>
            <p style="font-size: 18px;">Your shortened URL:</p>
            <a href="/${shortCode}" style="color: #4facfe; font-size: 18px; word-break: break-all;">${BASE_URL}/${shortCode}</a>
            <br><br>
            <a href="/" style="display: inline-block; background-color: #4facfe; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">Shorten Another</a>
          </div>
        </div>
    `);
}

module.exports = {
    renderShortenedURLHTML,
    renderAliasExistsHTML,
    renderInvalidHTML,
}