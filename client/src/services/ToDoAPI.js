import API from '@/services/API'

export default {

  /***************************
   *
   * Start of projects request functions
   *
   ***************************/

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
  },

  /***************************
   *
   * Start of projects request functions
   *
   ***************************/
  getProjects () {
    return API().get('getProjects') // getting the projects from db
  },
  addProject (title) {
    return API().post('addProject', {
      title: title
    });
  }
}
