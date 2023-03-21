import { defineStore } from 'pinia';

import api from '@/api';
import isValidJwt from '@/utils';

const useYakStore = defineStore('yakStorage', {
  state: () => ({ userName: '', jwt: '' }),
  getters: {
    getUserName: (state) => state.userName,
  },
  actions: {
    getGroup({ groupName }) {
      return api.getGroup(groupName, this.jwt);
    },
    getGroupResult({ groupName }) {
      return api.getGroupResult(groupName, this.jwt);
    },
    postBetsFinalePhase() {
      return api.postBetsFinalePhase(this.jwt);
    },
    getScoreBoard() {
      return api.getScoreBoard(this.jwt);
    },
    getGroupNames({ phaseName }) {
      return api.getGroupNames(phaseName, this.jwt);
    },
    putBetsByPhase({ phaseCode, bets }) {
      return api.putBetsByPhase(phaseCode, bets, this.jwt);
    },
    patchScoreBet({ betId, score1, score2 }) {
      return api.patchScoreBet(betId, score1, score2, this.jwt);
    },
    computePoints() {
      return api.postComputePoints(this.jwt);
    },
    setUserName(payload) {
      this.userName = payload.userName;
    },
    eraseJwtToken() {
      this.$reset();
    },
    setJwtToken(payload) {
      this.jwt = payload.jwt;
    },
    isAuthenticated() {
      return this.jwt && isValidJwt(this.jwt);
    },
  },
  persist: true,
});

export default useYakStore;
