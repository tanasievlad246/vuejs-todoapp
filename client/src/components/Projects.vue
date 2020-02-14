<template lang="html">
  <div>
    <!-- temporary toggle button -->
    <button
      v-if="this.button_toggle.proj_attr === true"
      @click="toggleProjectModal('block')"
    >
      Add Project
    </button>

    <!-- Start of the submit form for projects-->
    <form
      v-on:submit="addProject($event)"
      class="add-project-modal"
      id="project-modal"
    >
      <div class="form-group mt-3 submit-project">
        <input
          type="text"
          placeholder="Add a project title"
          v-model="projectTitle"
          class="form-control"
        />

        <input
          type="submit"
          class="btn btn-success btn-block mt-2"
          value="Create Project"
          v-on:click="toggleProjectModal('none')"
        />
      </div>
    </form>
    <!-- End of the submit form for projects-->

    <!-- Start of the submit form for todos-->
    <form
      id="todo-modal"
      class="add-todo-modal"
      v-on:submit="
        addTodo(
          $event,
          todoTitle,
          todoDescription,
          todoState,
          todoPriority,
          projectKey
        )
      "
    >
      <div class="form-group mt-3 submit-project">
        <input
          type="text"
          placeholder="Add a todo title title"
          v-model="todoTitle"
          class="form-control"
        />
        <input
          type="textbox"
          placeholder="Add todo description"
          class="form-control"
          v-model="todoDescription"
        />
        <select v-model="todoPriority">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <input
          type="submit"
          class="btn btn-success btn-block mt-2"
          value="+"
          v-on:click="toggleAddModal('none')"
        />
      </div>
    </form>
    <!-- End of the submit form for todos-->

    <!-- Start of edit todo modal -->
    <form
      id="edit-modal"
      class="add-todo-modal"
      v-on:submit="
        updateTodo(
          $event,
          updateObject.projectId,
          updateObject.todoId,
          updateObject.todo.title,
          updateObject.todo.description,
          updateObject.todo.priority
        )
      "
    >
      <div class="form-group mt-3 submit-project">
        <input
          type="text"
          placeholder="Add a todo title title"
          v-model="updateObject.todo.title"
          class="form-control"
        />
        <input
          type="textbox"
          placeholder="Add todo description"
          class="form-control"
          v-model="updateObject.todo.description"
        />
        <select v-model="updateObject.todo.priority">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <input
          type="submit"
          class="btn btn-success btn-block mt-2"
          value="edit"
          v-on:click="toggleEditModal('none')"
        />
      </div>
    </form>
    <!-- End of edit todo modal -->

    <!-- Start of the projects rendering -->
    <ul>
      <li v-for="project in projects" :key="project._id" class="project-pannel">
        {{ project.title }}
        <ul>
          <li v-for="todo in project.todos" :key="todo._id">
            <button v-on:click="deleteTodo(todo._id, project._id)">X</button>
            <button
              v-on:click="
                toggleEditModal('block');
                updateTodoDelegate(project._id, todo._id, todo);
              "
            >
              Edit
            </button>
            <button
              v-if="todo.state == 'complete'"
              v-on:click="changeState(project._id, todo._id, todo.state)"
            >
              Activate
            </button>
            <button
              v-if="todo.state == 'active'"
              v-on:click="changeState(project._id, todo._id, todo.state)"
            >
              Complete
            </button>
            <h4
              :style="
                todo.state === 'complete'
                  ? 'text-decoration: line-through;'
                  : 'text-decoration: none;'
              "
              class="mt-1 lead text-break"
            >
              {{ todo.title }}
            </h4>
            <p
              :style="
                todo.state === 'complete'
                  ? 'text-decoration: line-through;'
                  : 'text-decoration: none;'
              "
              class="mt-1 lead text-break"
            >
              {{ todo.description }}
            </p>
            <p>{{ todo.priority }}</p>
          </li>
        </ul>
        <button
          v-on:click="
            projectKeyChanger(project._id);
            toggleAddModal('block');
          "
        >
          Add Todo
        </button>
        <button v-on:click="deleteProject(project._id)">Delete</button>
      </li>
    </ul>
    <!-- End of the projects rendering -->
  </div>
</template>
<script>
import ToDoAPI from "@/services/ToDoAPI.js";

export default {
  data() {
    return {
      projectTitle: "",
      projects: [],
      todoTitle: "",
      todoDescription: "",
      todoPriority: "",
      todoState: "active",
      button_toggle: {
        proj_attr: true,
        todo_attr: true,
        edit_attr: true
      }, //attribut to toggle the add project modal
      projectKey: "", //holds the key for the project in which you insert the todo
      updateObject: {
        projectId: "",
        todoId: "",
        todo: {}
      }
    };
  },
  mounted() {
    this.getProjects();
  },
  methods: {
    async getProjects() {
      const response = await ToDoAPI.getProjects();
      this.projects = response.data;
    },
    async addProject(evt) {
      if (this.projectTitle) {
        evt.preventDefault(); // prevents the form's default action from redirecting the page
        const response = await ToDoAPI.addProject(this.projectTitle);
        this.getProjects();
        this.projectTitle = "";
      } else {
        alert("You need to add a title.");
      }
    },
    async addTodo(
      evt,
      todoTitle,
      todoDescription,
      todoState,
      todoPriority,
      url
    ) {
      if (this.todoTitle) {
        evt.preventDefault();
        await ToDoAPI.addTodoInProject(
          todoTitle,
          todoDescription,
          todoState,
          todoPriority,
          url
        );
        this.getProjects();
      } else {
        alert("You need a todo title");
      }
    },
    async deleteTodo(todoId, projectId) {
      await ToDoAPI.deleteTodoInProject(todoId, projectId);
      this.getProjects();
    },
    async deleteProject(key) {
      await ToDoAPI.deleteProject(key);
      this.getProjects();
    },
    async updateTodo(evt, projectId, todoId, title, description, priority) {
      if (this.updateObject.todo.title) {
        evt.preventDefault();
        await ToDoAPI.updateTodoInProject(
          projectId,
          todoId,
          title,
          description,
          priority
        );
        this.getProjects();
      } else {
        alert("add a title and try again");
        this.getProjects();
      }
    },
    async changeState(projectId, todoId, state) {
      let update = "";
      if (state === "complete") {
        update = "active";
      } else update = "complete";
      await ToDoAPI.changeTodoState(projectId, todoId, update);
      this.getProjects();
    },
    toggleAddModal(attr) {
      const add = document.getElementById("todo-modal");
      if (attr == "block") {
        add.style.display = "block";
        this.button_toggle.proj_attr = false;
      } else if (attr == "none") {
        add.style.display = "none";
        this.button_toggle.proj_attr = true;
      }
    },
    toggleProjectModal(attr) {
      const project = document.getElementById("project-modal");
      if (attr == "block") {
        project.style.display = "block";
        this.button_toggle.proj_attr = false;
      } else if (attr == "none") {
        project.style.display = "none";
        this.button_toggle.proj_attr = true;
      }
    },
    toggleEditModal(attr) {
      const edit = document.getElementById("edit-modal");
      if (attr == "block") {
        edit.style.display = "block";
        this.button_toggle.proj_attr = false;
      } else if (attr == "none") {
        edit.style.display = "none";
        this.button_toggle.proj_attr = true;
      }
    },
    projectKeyChanger(key) {
      this.projectKey = key;
    },
    updateTodoDelegate(projectId, todoId, todoObject) {
      // updateObject: {
      //   projectId: "",
      //   todoId: "",
      //   todo: ""
      // }

      this.updateObject.projectId = projectId;
      this.updateObject.todoId = todoId;
      this.updateObject.todo = todoObject;

      console.log(this.updateObject.todo);
    }
  }
};
</script>

<style lang="css">
.striketrough {
  text-decoration: line-through;
}

.submit-project {
  position: absolute;
  width: 400px;
  top: 40vh;
  left: 40vw;
  border: 3px solid black;
  border-radius: 25px;
  padding: 10px;
}

.add-project-modal {
  display: none;
  position: fixed;
  background: rgba(255, 125, 50, 0.3);
  width: 100%;
  height: 100%;
}

.project-pannel {
  border: 5px black solid;
  width: 400px;
}

.project-pannel li {
  border: 2px black solid;
  margin: 5px;
  width: 300px;
}

.add-todo-modal {
  display: none;
  position: fixed;
}
</style>
