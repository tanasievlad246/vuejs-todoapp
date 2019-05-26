import API from '@/services/API'

export default {
  getToDos () {
    return API().get('todo') // connecting to the api
  },
  addTodo (todo, description, state) {
    return API().post('addTodo', {
      todo: todo, // add our data to the response body
      description: description,
      state: state
    })
  },
  deleteTodo (todoID) {
    return API().post('deleteTodo', {
      todoID: todoID // add data to the request body
    })
  },
  updateTodo (todoID, todo, description, state) {
    return API().post('updateTodo', {
      todoID: todoID,
      todo: todo,
      description: description
    })
  },
  changeState (todoID, state) {
    return API().post('changeState', {
      todoID: todoID,
      state: state
    })
  }
}
