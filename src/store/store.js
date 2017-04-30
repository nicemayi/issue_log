import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

Vue.use(Vuex)

const _end = moment().add(1, 'd');;
const _start = moment(_end.diff(3600*1000*24*30));
const end = _end.format("YYYY-MM-DD");
const start = _start.format("YYYY-MM-DD");

export const store = new Vuex.Store({

  state: {
    login_user: '',
    is_login: false,
    is_admin: false,
    is_head: false,
    issues: [],
    groups: [],
    disable_new_issue_tab: true,
    issue_search_date_start: start,
    issue_search_date_end: end,
    belongs_to_department: null
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
    },
    get_is_head: (state) => {
      return state.is_head;
    },
    get_disable_new_issue: (state) => {
      return state.disable_new_issue_tab;
    },
    get_department: (state) => {
      return state.belongs_to_department;
    }
  },
  mutations: {
    LOAD_INFO(state) {
      const start = state.issue_search_date_start;
      const end = state.issue_search_date_end;
      Vue.http.post('/related-issues/', { start, end }).then(function (res) {
        let issues = res.data;
        state.issues = issues;
      }, function (err) {
        console.log("Error in login get-related-issues")
      });
      Vue.http.get('/related-groups/').then(function (res) {
        let groups = res.data;
        state.groups = groups;
      }, function (err) {
        console.log("Error in login get-related-groups")
      });
    },
    LOGIN(state, login_form) {
      Vue.http.post('/validate-user/', { login_form })
        .then(res => {
          const { username, msg, allowOpenNewIssue, is_admin, is_head, belongs_to_department } = res.data;
          if (msg == 'success') {
            state.login_user = username;
            state.is_login = true;
            state.is_admin = is_admin;
            state.is_head = is_head;
            state.belongs_to_department = belongs_to_department;
            state.disable_new_issue_tab = allowOpenNewIssue;
            store.commit('LOAD_INFO');
          }
        }, err => {
        console.log("Error in login");
      });
    },
    LOGOUT(state) {
      Vue.http.get('/logout-from-issue/').then(res => {
        state.login_user = '';
        state.is_login = false;
        state.is_admin = false;
        state.is_head = false;
        state.issues.length = 0;
        state.groups.length = 0;
        state.disable_new_issue_tab = true;
        state.belongs_to_department = null;
      }, err => {
        console.log("logout-from-issue In err");
      });
    },
    AUTH_USER(state) {
      Vue.http.get('/who-issue/').then(res => {
        const { username, msg, allowOpenNewIssue, is_admin, is_head, belongs_to_department } = res.data;
        if (msg == 'success') {
          state.login_user = username;
          state.is_login = true;
          state.is_admin = is_admin;
          state.is_head = is_head;
          state.disable_new_issue_tab = allowOpenNewIssue;
          state.belongs_to_department = belongs_to_department;
          store.commit('LOAD_INFO');
        }
      }, err => {
        console.log(err);
      })
    },
    CHANGE_ISSUE_DATE_RANGE(state, { start, end }) {
      state.issue_search_date_start = start;
      state.issue_search_date_end = end;
    }
  },
  actions: {
    login: ({ commit }, login_form) => {
      commit("LOGIN", login_form);
    },
    logout: ({ commit }) => {
      commit("LOGOUT");
    },
    reload: ({ commit }) => {
      commit("LOAD_INFO");
    },
    authUser: ({ commit }) => {
      commit("AUTH_USER");
    },
    changeIssueDateRange: ({ commit }, { start, end }) => {
      commit("CHANGE_ISSUE_DATE_RANGE", { start, end });
      commit("LOAD_INFO");
    } 
  }
})
