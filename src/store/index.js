import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import api from '@/api';
import isValidJwt from '@/utils';

const stateObject = {
  userName: '',
  jwt: '',
};

const actions = {
  getGroup(context, { groupName }) {
    return api.getGroup(groupName, context.state.jwt);
  },
  getGroupResult(context, { groupName }) {
    return api.getGroupResult(groupName, context.state.jwt);
  },
  postBetsFinalePhase(context) {
    return api.postBetsFinalePhase(context.state.jwt);
  },
  getScoreBoard(context) {
    return api.getScoreBoard(context.state.jwt);
  },
  getGroupNames(context, { phaseName }) {
    return api.getGroupNames(phaseName, context.state.jwt);
  },
  putBetsByPhase(context, { phaseCode, bets }) {
    return api.putBetsByPhase(phaseCode, bets, context.state.jwt);
  },
  patchScoreBet(context, { betId, score1, score2 }) {
    return api.patchScoreBet(betId, score1, score2, context.state.jwt);
  },
  login(context, userData) {
    return api.postLogin(userData);
  },
  signup(context, userData) {
    return api.postSignup(userData);
  },
  computePoints(context) {
    return api.postComputePoints(context.state.jwt);
  },
};

const mutations = {
  setUserName(state, payload) {
    state.userName = payload.userName;
  },
  setJwtToken(state, payload) {
    state.jwt = payload.jwt;
  },
  eraseJwtToken(state) {
    state.jwt = 'deleted';
    state.userName = '';
  },
};

const getters = {
  isAuthenticated(state) {
    return state.jwt && isValidJwt(state.jwt);
  },
  getUserName(state) {
    return state.userName;
  },
};

const vuexPersist = new VuexPersistence({
  key: 'myStorage',
  reducer: (state) => state,
});

const store = new Vuex.Store({
  stateObject,
  actions,
  mutations,
  getters,
  plugins: [vuexPersist.plugin],
});

export default store;
