import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    login_user: '',
    is_login: false,
    is_admin: false,
    issues: [],
    groups: [],
  },
  getters: {
    get_login_user: (state) => {
      return state.login_user;
    },
    get_is_login: (state) => {
      return state.is_login;
    },
    get_issues: (state) => {
      return state.issues;
    },
    get_groups: (state) => {
      return state.groups;
    },
    get_is_admin: (state) => {
      return state.is_admin;
    }
  },
  mutations: {
    AUTHENTICATION(state, username) {
      state.login_user = username[0];
      state.is_login = true;
      state.is_admin = (username[1] == 'true') ? true : false;
      store.commit('load_issues');
    },
    load_issues: state => {
      Vue.http.get('/related-issues/').then(function (res) {
        let issues = JSON.parse(res.data);
        state.issues = issues;
        // console.log(issues[0].issue_title);
        // console.log("successfully get issues: ", issues);
      }, function (err) {
        console.log("Error in login get-related-issues")
      });
      Vue.http.get('/related-groups/').then(function (res) {
        let groups = JSON.parse(res.data);
        state.groups = groups;
        // console.log(groups);
        // console.log("successfully get groups: ", groups);
      }, function (err) {
        console.log("Error in login get-related-groups")
      });
    },
    login: (state, login_form) => {
      let input_username = login_form.input_username;
      let input_password = login_form.input_password;
      Vue.http.post('/validate-user/', {
        login_form
      }).then(res => {
        let res_data = JSON.parse(res.data);
        if (res_data.msg == 'success') {
          state.login_user = login_form.input_username;
          state.is_login = true;
          state.is_admin = (res_data.role == "Admin") ? true : false;
          // console.log("in store: ", state.is_admin);
          store.commit('load_issues');
        }
      }, err => {
        console.log("Error in login");
      });
    },
    logout: state => {
        state.login_user = '';
        state.is_login = false;
        state.is_admin = false;
        state.groups.length = 0;
    },
    reload: state => {
      Vue.http.get('/related-issues/').then(function (res) {
        let issues = JSON.parse(res.data);
        state.issues = issues;
      }, function (err) {
        console.log("Error in login get-related-issues")
      });
      Vue.http.get('/related-groups/').then(function (res) {
        let groups = JSON.parse(res.data);
        state.groups = groups;
      }, function (err) {
        console.log("Error in login get-related-groups")
      });
    },
    authUser: state => {
      console.log("auth");
      Vue.http.get('/who/').then(res => {
        state.login_user = res.data;
        if (res.data != '') {
          state.is_login = true;
          Vue.http.get('/is-admin/').then(res => {
            state.is_admin = (res.data == 'true') ? true : false;
            Vue.http.get('/related-issues/').then(function (res) {
              let issues = JSON.parse(res.data);
              state.issues = issues;
            }, function (err) {
              console.log("Error in login get-related-issues")
            });
            Vue.http.get('/related-groups/').then(function (res) {
              let groups = JSON.parse(res.data);
              state.groups = groups;
              // console.log(groups);
              // console.log("successfully get groups: ", groups);
            }, function (err) {
              console.log("Error in login get-related-groups")
            });
          }, err => {
            console.log("err");
          })
        } else {
          state.is_login = false;
        }
      }, err => {
        console.log(err);
      })
    }
  },
  actions: {
    login: ({
      commit
    }, login_form) => {
      commit("login", login_form);
    },
    logout: ({
      commit
    }) => {
      Vue.http.get('/logout-from-issue/').then(res => {
          commit("logout");
      }, err => {
        console.log("In err");
      });
    },
    sort_issues: ({
      commit
    }, sort_by) => {
      commit("sort_issues", {
        sort_by
      });
    },
    reload: ({
      commit
    }) => {
      commit("reload");
    },
    authUser: ({
      commit
    }) => {
      commit("authUser");
    },
    userAuthentication: ({
      commit
    }) => {
      Vue.http.get("/auth-user/").then(
        (res) => {
          Vue.http.get("/is-admin/").then(
            (admin) => {
              commit("AUTHENTICATION", [res.data, admin.data]);
            }, (err) => {
              console.log("error", err);
            }
          );
        },
        (err) => {
          console.log("this is a err", err);
        }
      );
    }

  }
})
