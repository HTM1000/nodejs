//middlaware -> uma função que vai interceptar nossa requisição, sempre recebendo req e res como parametros, sendo tratados dentro ou transformados

export async function json(req, res){
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
     req.body = JSON.parse(Buffer.concat(buffers).toString())
  }
  catch{
    req.body = null
  }

  //formato sempre em json
  res.setHeader("Content-type", "application/json")
}