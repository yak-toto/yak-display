import { defineStore } from 'pinia';
import type { AllBetsResponse, ScoreBetWithGroupIdOut } from '@/client';
import { currentUserApiV1UsersCurrentGet, retrieveAllBetsApiV1BetsGet } from '@/client';

const useYakStore = defineStore('yakStorage', {
  state: () => ({
    userName: '',
    allBets: null as AllBetsResponse | null,
    allBetsPromise: null as Promise<void> | null,
    sessionPromise: null as Promise<boolean> | null,
  }),
  actions: {
    setUserName(userName: string) {
      this.userName = userName;
    },
    eraseAuthState() {
      this.$reset();
    },
    // Ask the backend whether the session cookie is valid. Concurrent calls
    // share a single request.
    async checkSession(): Promise<boolean> {
      if (this.sessionPromise) {
        return this.sessionPromise;
      }
      this.sessionPromise = (async () => {
        const { data } = await currentUserApiV1UsersCurrentGet();
        if (!data) {
          this.$reset();
          return false;
        }
        this.setUserName(data.result.name);
        return true;
      })();
      try {
        return await this.sessionPromise;
      } finally {
        this.sessionPromise = null;
      }
    },
    async fetchAllBets() {
      if (this.allBetsPromise) {
        return this.allBetsPromise;
      }
      this.allBetsPromise = (async () => {
        const { data } = await retrieveAllBetsApiV1BetsGet();
        if (data) {
          this.allBets = data.result;
        }
      })();
      try {
        await this.allBetsPromise;
      } finally {
        this.allBetsPromise = null;
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
});

export default useYakStore;
