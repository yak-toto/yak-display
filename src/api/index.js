// api/index.js

import axios from 'axios';

const URL = process.env.NODE_ENV === 'production' ? 'https://yak-toto.com' : 'http://127.0.0.1:5000';
const GLOBAL_ENDPOINT = 'api';
const VERSION = 'v1';
const BASE_URL = `${URL}/${GLOBAL_ENDPOINT}/${VERSION}`;

// ------------------------------
// Auth interface
// ------------------------------

export function postSignup(userData) {
  return axios.post(`${BASE_URL}/users/signup`, userData);
}

export function postLogin(userData) {
  return axios.post(`${BASE_URL}/users/login`, userData);
}

// ------------------------------
// Group interface
// ------------------------------

export function getGroupNames(phaseName, jwt) {
  return axios.get(`${BASE_URL}/groups/phases/${phaseName}`, { headers: { Authorization: `Bearer ${jwt}` } });
}

export function getGroup(groupName, jwt) {
  return axios.get(`${BASE_URL}/bets/groups/${groupName}`, { headers: { Authorization: `Bearer ${jwt}` } });
}

export function getGroupResult(groupName, jwt) {
  return axios.get(`${BASE_URL}/bets/groups/rank/${groupName}`, { headers: { Authorization: `Bearer ${jwt}` } });
}

export function postBetsFinalePhase(jwt) {
  return axios.post(`${BASE_URL}/bets/finale_phase`, null, { headers: { Authorization: `Bearer ${jwt}` } });
}

export function putBetsByPhase(phaseCode, bets, jwt) {
  return axios.put(`${BASE_URL}/bets/phases/${phaseCode}`, bets, { headers: { Authorization: `Bearer ${jwt}` } });
}

export function patchScoreBet(betId, score1, score2, jwt) {
  return axios.patch(
    `${BASE_URL}/bets/${betId}?type=score`,
    { team1: { score: score1 }, team2: { score: score2 } },
    { headers: { Authorization: `Bearer ${jwt}` } },
  );
}

// ------------------------------
// Result interface
// ------------------------------

export function getScoreBoard(jwt) {
  return axios.get(`${BASE_URL}/score_board`, { headers: { Authorization: `Bearer ${jwt}` } });
}

// ------------------------------
// Admin interface
// ------------------------------

export function postComputePoints(jwt) {
  return axios.post(`${BASE_URL}/compute_points`, null, { headers: { Authorization: `Bearer ${jwt}` } });
}
