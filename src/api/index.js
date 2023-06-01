// api/index.js

import axios from 'axios';

const URL = process.env.NODE_ENV === 'production' ? 'https://yak-toto.com' : 'http://127.0.0.1:8000';
const GLOBAL_ENDPOINT = 'api';
const VERSION = 'v1';
const BASE_URL = `${URL}/${GLOBAL_ENDPOINT}/${VERSION}`;
const LANG = 'fr';

function encodeBearerToken(jwtToken) {
  return `Bearer ${jwtToken}`;
}

const api = {
  // ------------------------------
  // Auth interface
  // ------------------------------
  postSignup(userData) {
    return axios.post(`${BASE_URL}/users/signup?lang=${LANG}`, userData);
  },
  postLogin(userData) {
    return axios.post(`${BASE_URL}/users/login?lang=${LANG}`, userData);
  },
  // ------------------------------
  // Group interface
  // ------------------------------
  getBetsByGroupCode(groupName, jwt) {
    return axios.get(
      `${BASE_URL}/bets/groups/${groupName}?lang=${LANG}`,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  getBetsByPhaseCode(phaseCode, jwt) {
    return axios.get(
      `${BASE_URL}/bets/phases/${phaseCode}?lang=${LANG}`,
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
    return axios.get(`${BASE_URL}/bets/groups/rank/${groupName}?lang=${LANG}`, {
      headers: { Authorization: encodeBearerToken(jwt) },
    });
  },
  modifyScoreBet(betId, score1, score2, jwt) {
    return axios.patch(
      `${BASE_URL}/score_bets/${betId}?lang=${LANG}`,
      { team1: { score: score1 }, team2: { score: score2 } },
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  modifyBinaryBet(id, body, jwt) {
    return axios.patch(
      `${BASE_URL}/binary_bets/${id}?lang=${LANG}`,
      body,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  // ------------------------------
  // Result interface
  // ------------------------------
  getScoreBoard(jwt) {
    return axios.get(`${BASE_URL}/score_board?lang=${LANG}`, { headers: { Authorization: encodeBearerToken(jwt) } });
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
  // ------------------------------
  // Rule interface
  // ------------------------------
  executeRule(ruleId, jwt) {
    return axios.post(
      `${BASE_URL}/rules/${ruleId}`,
      null,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
};

export default api;
