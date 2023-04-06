import { defineStore } from 'pinia';

import api from '@/api';
import isValidJwt from '@/utils';

const useYakStore = defineStore('yakStorage', {
  state: () => ({ userName: '', jwt: '' }),
  getters: {
    getUserName: (state) => state.userName,
  },
  actions: {
    getBetsByGroupCode({ groupName }) {
      return api.getBetsByGroupCode(groupName, this.jwt);
    },
    getBetsByPhaseCode({ phaseCode }) {
      return api.getBetsByPhaseCode(phaseCode, this.jwt);
    },
    getGroups() {
      return api.getGroups(this.jwt);
    },
    getGroupRankByCode({ groupName }) {
      return api.getGroupRankByCode(groupName, this.jwt);
    },
    postBetsFinalePhase() {
      return api.postBetsFinalePhase(this.jwt);
    },
    getScoreBoard() {
      return api.getScoreBoard(this.jwt);
    },
    putBetsByPhase({ phaseCode, bets }) {
      return api.putBetsByPhase(phaseCode, bets, this.jwt);
    },
    modifyScoreBet({ betId, score1, score2 }) {
      return api.modifyScoreBet(betId, score1, score2, this.jwt);
    },
    computePoints() {
      return api.postComputePoints(this.jwt);
    },
    executeRule(ruleId) {
      return api.executeRule(ruleId, this.jwt);
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
