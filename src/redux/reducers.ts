import { ProxyReducer } from '@philschatz/cevitxe-types'
import { ActionType } from './actions'

const { SET_FILTER, ADD_TODO, DESTROY_TODO, TOGGLE_TODO, EDIT_TODO, CLEAR_COMPLETED } = ActionType

export const proxyReducer: ProxyReducer = (state, { type, payload }) => {
  switch (type) {
    case ADD_TODO: {
      const { id, content } = payload
      return s => {
        // In case this is a new list
        if (!s.todoList) {
          s.todoList = []
        }
        if (!s.todoMap) {
          s.todoMap = {}
        }

        s.todoList.push(id)
        s.todoMap[id] = { id, content, completed: false }
      }
    }

    case DESTROY_TODO: {
      const { id } = payload
      return s => {
        delete s.todoMap[id]
        s.todoList = s.todoList.filter((_id: string) => _id !== payload.id)
      }
    }

    case TOGGLE_TODO: {
      const { id } = payload
      return s => (s.todoMap[id].completed = !s.todoMap[id].completed)
    }

    case EDIT_TODO: {
      const { id, content } = payload
      return s => (s.todoMap[id].content = content)
    }

    case SET_FILTER:
      return s => (s.visibilityFilter = payload.filter)

    case CLEAR_COMPLETED:
      return s => {
        s.todoList = s.todoList.filter((id: string) => !s.todoMap[id].completed)
        for (const id in s.todoMap) {
          if (!s.todoList.includes(id)) delete s.todoMap[id]
        }
      }

    default:
      console.log(`Unknown action ${type}`)
      return null
  }
}
