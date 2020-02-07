<template lang="html">
    <div>
      <ul>
        <li v-for="project in projects">
          {{project.title}}
          <ul>
            <li v-for="todo in project.todos">
            {{todo}}
            
            </li>
          </ul>          
        </li>
      </ul>
      
    </div>
</template>
<script>
import ToDoAPI from '@/services/ToDoAPI.js'

export default {
  data () {
    return {
      projectTitle: '',
      projects: [],
      todoTitle: '',
      todoDescription: '',
      todoPriority: ''
    }
  },
  mounted(){
    this.getProjects();
  },
  methods: {
    async getProjects(){
      const response = await ToDoAPI.getProjects()
      this.projects = response.data
    }
  }
}
</script>
<style lang="css">
</style>
