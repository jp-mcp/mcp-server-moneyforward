/**
 * OAuth2.0 Authorization Code Flow test for Money Forward
 * 1. Opens browser for authorization
 * 2. Listens on localhost for callback
 * 3. Exchanges code for access token
 */

import * as http from 'http';
import { execSync } from 'child_process';

const CLIENT_ID = process.env.MF_CLIENT_ID || '';
const CLIENT_SECRET = process.env.MF_CLIENT_SECRET || '';
const REDIRECT_URI = 'http://localhost:8080/callback';
const AUTH_URL = 'https://accounting.moneyforward.com/oauth/authorize';
const TOKEN_URL = 'https://accounting.moneyforward.com/oauth/token';

// マネフォのスコープ — 会計APIの読み取り
const SCOPES = 'office_setting:read';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('ERROR: Set MF_CLIENT_ID and MF_CLIENT_SECRET environment variables');
  process.exit(1);
}

const authorizationUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;

console.log('\n=== Money Forward OAuth2.0 Test ===\n');
console.log('Opening browser for authorization...');
console.log(`URL: ${authorizationUrl}\n`);

// Open browser
try {
  execSync(`start "${authorizationUrl}"`, { shell: 'cmd.exe' });
} catch {
  console.log('Could not open browser. Please open the URL manually.');
}

// Start local server to catch callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '', `http://localhost:8080`);

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error(`\nAuthorization error: ${error}`);
      res.writeHead(400);
      res.end(`Error: ${error}`);
      server.close();
      return;
    }

    if (!code) {
      console.error('\nNo authorization code received');
      res.writeHead(400);
      res.end('No code received');
      server.close();
      return;
    }

    console.log(`\nAuthorization code received: ${code.substring(0, 10)}...`);
    console.log('Exchanging for access token...\n');

    // Exchange code for token
    try {
      const tokenResponse = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        }).toString(),
      });

      const tokenData = await tokenResponse.json() as any;

      if (tokenData.access_token) {
        console.log('✅ SUCCESS! Access token received!');
        console.log(`Token type: ${tokenData.token_type}`);
        console.log(`Expires in: ${tokenData.expires_in}s`);
        console.log(`Scope: ${tokenData.scope}`);
        console.log(`\nAccess Token (first 20 chars): ${tokenData.access_token.substring(0, 20)}...`);
        if (tokenData.refresh_token) {
          console.log(`Refresh Token (first 20 chars): ${tokenData.refresh_token.substring(0, 20)}...`);
        }

        // Save tokens for further testing
        console.log('\n--- Full token response (for dev use only) ---');
        console.log(JSON.stringify(tokenData, null, 2));

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>✅ 認証成功！</h1><p>このタブは閉じてOKです。</p>');
      } else {
        console.error('❌ Token exchange failed:');
        console.error(JSON.stringify(tokenData, null, 2));
        res.writeHead(400);
        res.end('Token exchange failed');
      }
    } catch (err) {
      console.error('❌ Token exchange error:', err);
      res.writeHead(500);
      res.end('Server error');
    }

    setTimeout(() => server.close(), 1000);
  }
});

server.listen(8080, () => {
  console.log('Listening on http://localhost:8080/callback for OAuth callback...');
  console.log('(Waiting for browser authorization...)\n');
});
