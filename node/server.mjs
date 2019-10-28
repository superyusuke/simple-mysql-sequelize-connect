console.log("this is server");

import * as http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer(function(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

server.listen(PORT);
console.log(`Server running at http://localhost:${PORT} in host`);
