// api/index.js

import axios from 'axios';

const URL = process.env.NODE_ENV === 'production' ? 'https://yak-toto.com' : 'http://127.0.0.1:8000';
const GLOBAL_ENDPOINT = 'api';
const VERSION = 'v1';
const BASE_URL = `${URL}/${GLOBAL_ENDPOINT}/${VERSION}`;

function encodeBearerToken(jwtToken: string) {
  return `Bearer ${jwtToken}`;
}

const api = {
  // ------------------------------
  // Auth interface
  // ------------------------------
  postSignup(userData: Object) {
    return axios.post(`${BASE_URL}/users/signup`, userData);
  },
  postLogin(userData: Object) {
    return axios.post(`${BASE_URL}/users/login`, userData);
  },
  // ------------------------------
  // Group interface
  // ------------------------------
  getBetsByGroupCode(groupName: string, jwt: string) {
    return axios.get(
      `${BASE_URL}/bets/groups/${groupName}`,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  getBetsByPhaseCode(phaseCode: string, jwt: string) {
    return axios.get(
      `${BASE_URL}/bets/phases/${phaseCode}`,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  getGroups(jwt: string) {
    return axios.get(
      `${BASE_URL}/groups`,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  getGroupRankByCode(groupName: string, jwt: string) {
    return axios.get(`${BASE_URL}/bets/groups/rank/${groupName}`, {
      headers: { Authorization: encodeBearerToken(jwt) },
    });
  },
  modifyScoreBet(betId: string, score1: bigint, score2: bigint, jwt: string) {
    return axios.patch(
      `${BASE_URL}/score_bets/${betId}`,
      { team1: { score: score1 }, team2: { score: score2 } },
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  modifyBinaryBet(id: string, body: Object, jwt: string) {
    return axios.patch(
      `${BASE_URL}/binary_bets/${id}`,
      body,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  // ------------------------------
  // Result interface
  // ------------------------------
  getScoreBoard(jwt: string) {
    return axios.get(`${BASE_URL}/score_board`, { headers: { Authorization: encodeBearerToken(jwt) } });
  },
  // ------------------------------
  // Admin interface
  // ------------------------------
  postComputePoints(jwt: string) {
    return axios.post(
      `${BASE_URL}/compute_points`,
      null,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
  // ------------------------------
  // Rule interface
  // ------------------------------
  executeRule(ruleId: string, jwt: string) {
    return axios.post(
      `${BASE_URL}/rules/${ruleId}`,
      null,
      { headers: { Authorization: encodeBearerToken(jwt) } },
    );
  },
};

export default api;
