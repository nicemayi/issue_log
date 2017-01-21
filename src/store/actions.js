import Vue from 'vue';
import * as types from './mutation-types';

export const userAuthentication = ({commit}) => {
  console.log("in actions , userAuthentication");
  Vue.http.get("/auth-user/").then(
    (res) => {
      commit(types.AUTHENTICATION, username);
    },
    (err) => {
      console.log("this is a err", err);
    }
  );
}

