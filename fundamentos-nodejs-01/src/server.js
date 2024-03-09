// CommonJS => require
// ESModules => import/export

import http from "node:http"
import { json } from "./middlewares/json.js"
import { routes } from "./routes.js"
import { extractQueryParams } from "./utils/extract-query-params.js"

/*
  - Criar usuários
  - Listagem usuários
  - Edição de usuários
  - Remoção de usuários

  - HTTP
   - Método HTTP
   - URL
*/

// GET, POST, PUT, PATCH, DELETE

// GET => Buscar informações do back-end
// POST => Criar uma informação no back-end
// PUT => Editar/Atualizar uma informação no back-end
// PATCH => Atualizar uma única informação de um recurso no back-end

//GET/users - Buscando usuarios
//POST/users - Adicionando usuarios

// Stateful - Statelass

// JSON - Javascript Object Notation

// Cabeçalhos (Requisição/resposta) => Metadados

/* 
  HTTP Status Code
  100 - 199 => informações
  200 - 299 => sucesso
  300 - 399 => redirecionamento, rota que nao existe mais e foi redirecionada para outra
  400 - 499 => informações enviadas ao back-end com erro
  500 - 599 => erro no servidor
*/

// UUID id unico e universal

/*
  Query Parameters: parametros nomeados enviados no endereço da requisição - URL Stateful, informações não sensiveis, muito utilizados para filtros, paginar, buscar... não são informações obrigatórios
    http://localhost:3334/users?userId=1&name=Renato
  Route Parameters: parametros nao nomeados que ficam na rota, identificação de recursos
    GET http://localhost:3333/users/1
    DELETE http://localhost:3333/users/1
  Request Body: envio de informações de um formulário, quantas informações você quiser [HTTPS], mais dificil de ser interceptados
    POST http://localhost:3333/users
*/

// Edição e remoção do usuário

// Criar um usuario (name, email)
const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(router => {
    return router.method === method && router.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups
    req.params = params
    req.query = query ? extractQueryParams(query) : {}
  
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)