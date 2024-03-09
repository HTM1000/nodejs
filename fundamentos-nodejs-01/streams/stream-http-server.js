import http from 'node:http'

import { Transform } from 'node:stream'

class InverseNumberStream extends Transform {
  _transform(chunk, enconding, callback) {
    const transformed = Number(chunk.ToString()) * -1

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }
}

//req -> readableStream
//res -> writableStream

const server = http.createServer(async (req, res) => {
  const buffers = []

  //async/wait -> guarda cada pedaço da stream ser retornado
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  //formato de json é inviavel
  // { "name": "Diego", "email": "diego@gmail.com" }

  const fullStreamContent = Buffer.concat(buffers).toString()

  console.log(fullStreamContent)

  return res.end(fullStreamContent)

  // return req.pipe(new InverseNumberStream())
  //           .pipe(res)
})

server.listen(3334)