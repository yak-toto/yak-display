import { defineStore } from 'pinia';

const useYakStore = defineStore('yakStorage', {
  state: () => ({ userName: '', isLoggedIn: false }),
  getters: {
    getUserName: (state) => state.userName,
  },
  actions: {
    setUserName(userName: string) {
      this.userName = userName;
    },
    setLoggedIn(loggedIn: boolean) {
      this.isLoggedIn = loggedIn;
    },
    eraseAuthState() {
      this.$reset();
    },
    isAuthenticated() {
      return this.isLoggedIn;
    },
  },
  persist: true,
});

export default useYakStore;
