#!/usr/bin/env node
const server = require("fastify")();
const fetch = require("node-fetch");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.target || "127.0.0.1:4000";
const log = require('./logstash.js');

(async () => {
  await server.register(require('middie')); // generic middleware
  server.use((req, res, next) => { // middleware to log incoming requests
    log('info', 'request-incoming', { // call to the loggers that logs request data
      path: req.url, method: req.method, ip:req.ip,
      ua: req.headers['user-agent'] || null 
    })
  })

  server.setErrorHandler(async (error, req) => {
    log('error', 'request-failure', {stack: error.stack,
      path: req.url, method: req.method, })
    return { error: error.message } 
  })

  server.get('/', async  () => {
    const url = `http://${TARGET}/recipes/42`
    log('info', 'request-outgoing', {url, svc: 'recipe-api'}) // information about outbound requests is logged
    const req = await fetch(url)
    const producer_data = await req.json()
    return { consumer_pid: process.pid, producer_data }
  })
  server.get('/error', async () => {
    throw new Error('oh no')    
  })
  server.listen(PORT, HOST, () => {
    log('verbose', 'listen', { host:HOST,port:PORT }) // information about servers is also logged
  })
})();

