<template>
  <div>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
        <div>
          <label for="">Username</label>
          <input v-model="form.username" />
          <label for="">Fullname</label>
          <input v-model="form.fullname" /> <br />
          <br />
          <label for="">Age</label>
          <input v-model="form.age" />
          <label for="">Email</label>
          <input v-model="form.email" />
          <br /><br />
          <button @click="addfriend" class="btn-link">Add Friend</button>
        </div>
        <br /><br /><br />
      </div>
</template>



<script>
  import { useRepo } from "pinia-orm";
  import { createPinia } from "pinia";
  import { createORM } from "pinia-orm";
  import Person from "../stores/Person.js";
  
  const pinia = createPinia().use(createORM());
  const usePerson = useRepo(Person, pinia);

  export default {
    name: 'ContactsTable',
    data() {
      return {
        form: {
          username: "",
          fullname: "",
          age: "",
          email: "",
        },
      };
    },

    methods: {
      addfriend() {
        usePerson.save({
          Username: this.form.username,
          Fullname: this.form.fullname,
          Age: this.form.age,
          Email: this.form.email,
        });
        console.log(usePerson.all());
      },
    },
};
</script>