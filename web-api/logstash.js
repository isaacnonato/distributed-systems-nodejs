const client = require('dgram').createSocket('udp4') // the dgram module sends udp messages
const host = require('os').hostname()
const [LS_HOST, LS_PORT] = process.env.LOGSTASH.split(':') // logstash location is stored in LOGSTASH 
const NODE_ENV = process.env.NODE_ENV

module.exports = (severity, type, fields) => {
  const payload = JSON.stringify({ // several fields sent in log message
    '@timestamp': (new Date()).toISOString(),
    '@version': 1, app: 'web-api', environment: NODE_ENV, severity, type, fields, host
  })
  console.log(payload)
  client.send(payload, LS_PORT, LS_HOST)
}
