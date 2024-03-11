import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface tables {
    users: {
      id: string
      name: string
      created_at: string
      session_id?: string
    }

    meals: {
      id: string
      name: string
      description: string
      meal_date_time: string
      diet: boolean
      user_id: string
      created_at: string
    }
  }
}