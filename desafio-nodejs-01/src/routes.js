import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const users = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        create_at: Date(),
        updated_at: Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end('Tarefa adicionada com sucesso')
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end('Tarefa deletada com sucesso')
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (title?.length > 0 && description?.length > 0) {
        return res.writeHead(400).end("Você não pode alterar o Titulo e Descrição ao mesmo tempo, realize uma alteração de cada vez!")
      }

      const task = database.selectById('tasks', id)
      if (!task) {
        return res.writeHead(400).end("Tarefa não encontrada para ser atualizada!")
      }

      const updatedFields = {
        ...task,
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        updated_at: Date()
      }

      database.update('tasks', id, updatedFields)

      return res.writeHead(204).end('Tarefa atualizada com sucesso')
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)
      if (!task) {
        return res.writeHead(400).end("Tarefa não encontrada para ser atualizada!")
      }

      const updatedFields = {
        ...task,
        completed_at: Date(),
      }

      database.update('tasks', id, { updatedFields })

      return res.writeHead(204).end('Tarefa concluida com sucesso')
    }
  },
] 