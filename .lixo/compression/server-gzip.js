const zlib = require("zlib");
const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
  const raw = fs.createReadStream(__dirname + "/index.html");
  const acceptEncoding = req.headers["accept-encoding"] || "";
  res.setHeader("Content-Type", "text/plain");

  if (acceptEncoding.includes("gzip")) {
    console.log("encoding with gzip");
    res.setHeader("Content-Encoding", "gzip");
    raw.pipe(zlib.createGzip()).pipe(res);
  } else {
    console.log("no encoding");
    raw.pipe(res);
  }
}).listen(1337);
