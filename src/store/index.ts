import { defineStore } from 'pinia';

import isValidJwt from '@/utils';

const useYakStore = defineStore('yakStorage', {
  state: () => ({ userName: '', jwt: '' }),
  getters: {
    getUserName: (state) => state.userName,
  },
  actions: {
    setUserName(userName: string) {
      this.userName = userName;
    },
    eraseJwtToken() {
      this.$reset();
    },
    setJwtToken(jwt: string) {
      this.jwt = jwt;
    },
    isAuthenticated() {
      return this.jwt && isValidJwt(this.jwt);
    },
  },
  persist: true,
});

export default useYakStore;
