import API from '@/services/API'

export default {
  getToDos () {
    return API().get('todo') // connecting to the api
  },
  addTodo (todo) {
    return API().post('addTodo', {
      todo: todo // add our data to the response body
    })
  },
  deleteTodo (todoID) {
    return API().post('deleteTodo', {
      todoID: todoID // add data to the request body
    })
  }
}
