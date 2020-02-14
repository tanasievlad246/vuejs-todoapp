import API from "@/services/API";

export default {
  /***************************
   *
   * Start of projects request functions
   *
   ***************************/

  getToDos() {
    return API().get("todo"); // connecting to the api
  },
  addTodo(todo, description, state) {
    return API().post("addTodo", {
      todo: todo, // add our data to the response body
      description: description,
      state: state
    });
  },
  deleteTodo(todoID) {
    return API().post("deleteTodo", {
      todoID: todoID // add data to the request body
    });
  },
  updateTodo(todoID, todo, description, state) {
    return API().post("updateTodo", {
      todoID: todoID,
      todo: todo,
      description: description
    });
  },
  changeState(todoID, state) {
    return API().post("changeState", {
      todoID: todoID,
      state: state
    });
  },

  /***************************
   *
   * Start of projects request functions
   *
   ***************************/
  getProjects() {
    return API().get("getProjects"); // getting the projects from db
  },
  addProject(title) {
    return API().post("addProject", {
      title: title
    });
  },
  deleteProject(key) {
    return API().delete(`/deleteProject/${key}`, {
      project_key: key
    });
  },
  addTodoInProject(title, description, state, priority, url) {
    return API().post(`/addTodoProject/${url}`, {
      title: title,
      description: description,
      state: state,
      priority: priority
    });
  },
  deleteTodoInProject(todoId, projectId) {
    return API().post(`/deleteTodoInProject/${projectId}`, {
      _id: todoId
    });
  },
  updateTodoInProject(projectId, todoId, title, description, priority) {
    return API().put(`/updateTodoInProject/${projectId}/${todoId}`, {
      title: title,
      description: description,
      priority: priority
    });
  },
  changeTodoState(projectId, todoId, state) {
    return API().put(`/updateTodoState/${projectId}/${todoId}`, {
      state: state
    });
  }
};
