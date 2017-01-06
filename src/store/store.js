import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        login_user : '',
        is_login: false,
        issues: [],
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
        }
    },
    mutations: {
        login: (state, login_form) => {
            let input_username = login_form.input_username;
            let input_password = login_form.input_password;
            Vue.http.post('/validate-user/', { login_form }).then(res => {
                let res_data = res.data;
                if (res_data == 'success') {
                    state.login_user = login_form.input_username;
                    state.is_login = true;
                    Vue.http.get('/related-issues/').then(function(res){
                        let issues = JSON.parse(res.data);
                        state.issues = issues;
                        console.log(issues[0].issue_title);
                        console.log("successfully get issues: ", issues);
                    }, function(err){
                        console.log("Error in login get-related-issues")
                    });
                }
            }, err => {
                console.log("Error in login");
            });
        },
        logout: state => {
            Vue.http.get('/logout-from-issue/').then(res => {
                state.login_user = '';
                state.is_login = false;
            }, err => {
                console.log("In err");
            });
        },
        sort_issues: (state, command) => {
            if (command.sortby == "issue number") {
                console.log("Issue sort by issue number");
            } else if (command.sortby == "issue open date") {
                console.log("Issue sort by issue open date");
            } else if (command.sortby == "issue opened by") {
                console.log("Issue sort by issue opened by");
            }
        }
    },
    actions: {
        login: ({ commit }, login_form) => {
            commit("login", login_form);
        },
        logout: ({ commit }) => {
            commit("logout");
        },
        sort_issues: ({ commit }, sort_by) => {
            commit("sort_issues", {sort_by});
        }
    }
})