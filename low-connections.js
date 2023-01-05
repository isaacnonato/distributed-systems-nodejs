const http = require("http");

const server = http.createServer((req, res) => {
  console.log("current connection", server._connections);
  setTimeout(() => res.end("OK"), 10_000); // this simulates some slow asynchronous activity, like a database operation
});

server.maxConnections = 2;
server.listen(3020, "127.0.0.1");
