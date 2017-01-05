import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        login_user : '',
        is_login: false
    },
    getters: {
        get_login_user: (state) => {
            return state.login_user;
        },
        get_is_login: (state) => {
            return state.is_login;
        }
    },
    mutations: {
        login: (state, login_form) => {
            let input_username = login_form.input_username;
            let input_password = login_form.input_password;
            // if (!)

            Vue.http.post('/validate-user/', { login_form }).then(res => {
                let res_data = res.data;
                if (res_data == 'success') {
                    state.login_user = login_form.input_username;
                    state.is_login = true;
                }
            }, err => {
                //
            });
        },
        logout: state => {
            state.login_user = '';
            state.is_login = false;
        }
    },
    actions: {
        login: ({ commit }, login_form) => {
            commit("login", login_form);
        },
        logout: ({ commit }) => {
            commit("logout");
        }
    }
})