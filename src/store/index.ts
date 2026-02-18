import { defineStore } from 'pinia';
import type { AllBetsResponse, ScoreBetWithGroupIdOut } from '@/client';
import { retrieveAllBetsApiV1BetsGet } from '@/client';

const useYakStore = defineStore('yakStorage', {
  state: () => ({
    userName: '',
    isLoggedIn: false,
    allBets: null as AllBetsResponse | null,
  }),
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
    async fetchAllBets() {
      const { data } = await retrieveAllBetsApiV1BetsGet();
      if (data) {
        this.allBets = data.result;
      }
    },
    updateStoreBets(updatedBets: ScoreBetWithGroupIdOut[]) {
      if (!this.allBets) return;
      const updatedIds = new Set(updatedBets.map((b) => b.id));
      this.allBets.score_bets = this.allBets.score_bets.map((bet) => {
        const updated = updatedBets.find((b) => b.id === bet.id);
        return updatedIds.has(bet.id) && updated ? updated : bet;
      });
    },
  },
  persist: {
    pick: ['userName', 'isLoggedIn'],
  },
});

export default useYakStore;
