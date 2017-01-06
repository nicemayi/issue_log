<style>
  body {
     height: 1800px;
  }
</style>

<template>
  <div id="app">
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <ul class="nav navbar-nav">
          <li class="active"><a>Home</a></li>
        </ul>
        <form class="navbar-form navbar-right" v-if="is_login">
          <div class="form-group active"><a style="color:white;">Hi {{current_loggin_user}}!&nbsp&nbsp&nbsp</a></div>
          <button type="submit" class="btn btn-success" @click="logout_btn">Sign Out</button>
        </form>
        <form v-else class="navbar-form navbar-right">
          <div class="form-group">
            <input type="text" placeholder="User Name" name="user" class="form-control" v-model="login_form.input_username" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Password" name="password" class="form-control" v-model="login_form.input_password" required>
          </div>
          <button type="submit" class="btn btn-success" @click.prevent.default="login_btn">Sign in</button>
        </form>
      </div>
    </nav>
    <issues></issues>
  </div>
</template>

<script>

import Issues from './components/IssuePage';
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'app',
  components: {
    Issues
  },
  data() {
    return {
      login_form: {
        input_username: '',
        input_password: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      current_loggin_user: 'get_login_user',
      is_login: 'get_is_login'
    })
  },
  methods: {
    ...mapActions({
      login: 'login',
      logout: 'logout'
    }),
    login_btn() {
      this.$store.dispatch('login', {
        input_username: this.login_form.input_username,
        input_password: this.login_form.input_password
      });
    },
    logout_btn() {
      this.$store.dispatch('logout');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
