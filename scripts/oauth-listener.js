const http = require("http");
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "", "http://localhost:8080");
  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    if (error) { console.log("ERROR:" + error); res.writeHead(400); res.end("Error: " + error); server.close(); return; }
    if (!code) { console.log("NO_CODE"); res.writeHead(400); res.end("No code"); server.close(); return; }
    console.log("CODE_RECEIVED (first 10):" + code.substring(0, 10) + "...");
    try {
      const resp = await fetch("https://api.biz.moneyforward.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + Buffer.from(process.env.MF_CLIENT_ID + ":" + process.env.MF_CLIENT_SECRET).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "http://localhost:8080/callback",
        }).toString(),
      });
      const data = await resp.json();
      if (data.access_token) {
        console.log("SUCCESS!");
        console.log("access_token:" + data.access_token);
        if (data.refresh_token) console.log("refresh_token:" + data.refresh_token);
        console.log("expires_in:" + data.expires_in);
        console.log("scope:" + data.scope);
      } else {
        console.log("TOKEN_ERROR:" + JSON.stringify(data));
      }
      res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
      res.end("<h1>OK!</h1><p>Close this tab.</p>");
    } catch (err) {
      console.log("FETCH_ERROR:" + err.message);
      res.writeHead(500); res.end("Error");
    }
    setTimeout(() => server.close(), 1000);
  }
});
server.listen(8080, () => console.log("LISTENING on http://localhost:8080/callback"));
