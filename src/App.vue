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
          <li class="active"><a href='/'>Home</a></li>
          <li><a href="/dashboard/">Dashboard</a></li>
          <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Pending List<span class="caret"></span></a>
              <ul class="dropdown-menu">
                  <li><a href="/roche-pending/">Roche Pending List</a></li>
                  <li><a href="/PendingList/">Vibrant Pending List</a></li>
              </ul>
          </li>
          <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Useful Links <span class="caret"></span></a>
              <ul class="dropdown-menu">
                  <li><a href="/sample_review/">Sample Review</a></li>
                  <li><a href="/tobarcodeInformationPage/">Sample Barcode</a></li>
                  <li><a href="/sysmex-sample-barcode/">Sysmex Sample Barcode</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/ESR/" target="_blank">ESR LogSheet</a></li>
                  <li><a href="/ENA/" target="_blank">ENA resutls</a></li>
                  <li><a href="/CELIAC/" target="_blank">Celiac results</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">Looking for samples</li>
                  <li><a id="tsp_pending" href="/TSP/" target="_blank" >aliquot samples for TSP</a></li>
                  <li><a href="/NS/" target="_blank">No-serum or Phadia only samples</a></li>
                  <li><a href="/ENA_Positive/" target="_blank">ENA Positive Samples</a></li>
                  <li><a href="/VG_Pending/" target="_blank">Vibrant Genomics Pending List</a></li>
                  <li><a href="/Phadia2000_Pending/" target="_blank">Phadia Pending Report</a></li>
                  <li><a href="/WheatZoomer_Pending/" target="_blank">Wheat-Zoomer Pending Report</a></li>
                  <li><a href="/TSP_EXTRA_TESTS/" target="_blank">COQ10, RT3 and HIGFI pending report</a></li>
                  <li><a href="/ANA_Pending/" target="_blank">ANA pending report</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/downloadprintlabel/">Download Report Label file</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/VA-test-information/">Test Information</a></li>
              </ul>
          </li>
          <li><a href="/inventory/">Inventory</a></li>
          <li><a href="/issue-log/">Issue Log</a></li>
        </ul>
        <form class="navbar-form navbar-right" v-if="is_login">
          <div class="form-group active"><a href="/profile/" style="color:white;">Hi {{current_loggin_user}}!&nbsp&nbsp&nbsp</a></div>
          <button type="submit" class="btn btn-success" @click.prevent.default="logout_btn">Sign Out</button>
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
  created: function() {
    this.authUser();
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
      logout: 'logout',
      authUser: 'authUser'
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
