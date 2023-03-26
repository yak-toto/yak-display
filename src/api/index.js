// api/index.js

import axios from 'axios';

const URL = process.env.NODE_ENV === 'production' ? 'https://yak-toto.com' : 'http://127.0.0.1:5000';
const GLOBAL_ENDPOINT = 'api';
const VERSION = 'v1';
const BASE_URL = `${URL}/${GLOBAL_ENDPOINT}/${VERSION}`;

function encodeBearerToken(jwtToken) {
  return `Bearer ${jwtToken}`;
}

const api = {
  // ------------------------------
  // Auth interface
  // ------------------------------
  postSignup(userData) {
    return axios.post(`${BASE_URL}/users/signup`, userData);
  },
  postLogin(userData) {
    return axios.post(`${BASE_URL}/users/login`, userData);
  },
  // ------------------------------
  // Group interface
  // ------------------------------
  getBetsByGroupCode(groupName, jwt) {
    return axios.get(
      `${BASE_URL}/bets/groups/${groupName}`,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  getGroups(jwt) {
    return axios.get(
      `${BASE_URL}/groups`,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  getGroupRankByCode(groupName, jwt) {
    return axios.get(`${BASE_URL}/bets/groups/rank/${groupName}`, {
      headers: { Authorization: encodeBearerToken(jwt) },
    });
  },
  postBetsFinalePhase(jwt) {
    return axios.post(
      `${BASE_URL}/bets/finale_phase`,
      null,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  putBetsByPhase(phaseCode, bets, jwt) {
    return axios.put(`${BASE_URL}/binary_bets/phases/${phaseCode}`, bets, {
      headers: { Authorization: encodeBearerToken(jwt) },
    });
  },
  modifyScoreBet(betId, score1, score2, jwt) {
    return axios.patch(
      `${BASE_URL}/score_bets/${betId}`,
      { team1: { score: score1 }, team2: { score: score2 } },
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  // ------------------------------
  // Result interface
  // ------------------------------
  getScoreBoard(jwt) {
    return axios.get(`${BASE_URL}/score_board`, { headers: { Authorization: encodeBearerToken(jwt) } });
  },
  // ------------------------------
  // Admin interface
  // ------------------------------
  postComputePoints(jwt) {
    return axios.post(
      `${BASE_URL}/compute_points`,
      null,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
};

export default api;
