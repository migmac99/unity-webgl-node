require('dotenv').config()

const express = require('express')
const mime = require('mime-types')
const path = require('path')
const app = express()
const port = 80

const root = path.join(__dirname, 'public')

function setHeaders(res, path) {
  if (path.endsWith('.gz') || path.endsWith('.br')) {
    res.set({
      'Content-Type': mime.lookup(path.substr(0, path.length - 3)) || 'application/octet-stream',
      'Content-Encoding': path.endsWith('.gz') ? 'gzip' : 'brotli',
    })
  }
}

app.get('/api/env', (req, res) => {
  res.header('Content-Type', 'application/json')

  // Filter out all envs that start with PUBLIC-
  const filtered = Object.keys(process.env)
    .filter(key => key.startsWith('PUBLIC-'))
    .reduce((obj, key) => {
      let v = process.env[key]
      let k = key.replace('PUBLIC-', '')
      obj[k] = v
      return obj
    }, {})

  res.send(JSON.stringify(filtered, null, 4))
})

app.get('/api/env/:val', (req, res) => {
  const val = req.params.val.startsWith('PUBLIC-') ? req.params.val : `PUBLIC-${req.params.val}`
  const value = process.env[val]

  console.log(`[ GET ] [ API ] /api/${val.replace('PUBLIC-', '')} => ${value}`)
  res.send(value)
})

app.use(express.static(root, { setHeaders: setHeaders }))

app.listen(port, () => {
  console.log(`Unity WEBGL server listening at http://localhost:${port}`)
})