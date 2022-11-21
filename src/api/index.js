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
  return axios.post(`${BASE_URL}/signup`, userData);
}

export function postLogin(userData) {
  return axios.post(`${BASE_URL}/login`, userData);
}

// ------------------------------
// Group interface
// ------------------------------

export function getGroupNames(phaseName, jwt) {
  return axios.get(`${BASE_URL}/groups/phases/${phaseName}`, { headers: { Authorization: `Bearer: ${jwt}` } });
}

export function getGroup(groupName, jwt) {
  return axios.get(`${BASE_URL}/bets/groups/${groupName}`, { headers: { Authorization: `Bearer: ${jwt}` } });
}

export function getGroupResult(groupName, jwt) {
  return axios.get(`${BASE_URL}/bets/groups/results/${groupName}`, { headers: { Authorization: `Bearer: ${jwt}` } });
}

export function getBetByPhase(phaseName, jwt) {
  return axios.get(`${BASE_URL}/bets/phases/${phaseName}`, { headers: { Authorization: `Bearer: ${jwt}` } });
}

export function patchBets(bets, jwt) {
  return axios.patch(
    `${BASE_URL}/bets`,
    bets,
    { headers: { Authorization: `Bearer: ${jwt}` } },
  );
}

// ------------------------------
// Result interface
// ------------------------------

export function getScoreBoard(jwt) {
  return axios.get(`${BASE_URL}/score_board`, { headers: { Authorization: `Bearer: ${jwt}` } });
}

// ------------------------------
// Admin interface
// ------------------------------

export function postComputePoints(jwt) {
  return axios.post(`${BASE_URL}/compute_points`, null, { headers: { Authorization: `Bearer: ${jwt}` } });
}
