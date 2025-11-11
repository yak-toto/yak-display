import { defineStore } from 'pinia';

import api from '@/api';

interface SetJwtTokenPayload {
  jwt: string;
  refreshToken?: string;
  accessExpiresIn?: number;
  refreshExpiresIn?: number;
}

interface SetUserNamePayload {
  userName: string;
}

const useYakStore = defineStore('yakStorage', {
  state: () => ({
    userName: '',
    jwt: '', // Keep in memory only
    refreshToken: '', // Keep refresh token in memory too
    tokenExpiry: null as number | null,
    refreshTokenExpiry: null as number | null,
  }),
  getters: {
    getUserName: (state) => state.userName,
    isAuthenticated: (state) => {
      // Check both token existence and expiration
      return !!state.jwt && !!state.tokenExpiry && state.tokenExpiry > Date.now();
    },
  },
  actions: {
    getBetsByGroupCode({ groupName }: { groupName: string }) {
      return api.getBetsByGroupCode(groupName, this.jwt);
    },
    getBetsByPhaseCode({ phaseCode }: { phaseCode: string }) {
      return api.getBetsByPhaseCode(phaseCode, this.jwt);
    },
    getGroups() {
      return api.getGroups(this.jwt);
    },
    getGroupRankByCode({ groupName }: { groupName: string }) {
      return api.getGroupRankByCode(groupName, this.jwt);
    },
    getScoreBoard() {
      return api.getScoreBoard(this.jwt);
    },
    modifyScoreBet({
      betId,
      score1,
      score2,
    }: {
      betId: string | number;
      score1: number;
      score2: number;
    }) {
      return api.modifyScoreBet(betId, score1, score2, this.jwt);
    },
    modifyBinaryBet(id: string | number, body: unknown) {
      return api.modifyBinaryBet(id, body, this.jwt);
    },
    computePoints() {
      return api.postComputePoints(this.jwt);
    },
    executeRule(ruleId: string | number) {
      return api.executeRule(ruleId, this.jwt);
    },
    setUserName(payload: SetUserNamePayload) {
      this.userName = payload.userName;
    },
    eraseJwtToken() {
      this.jwt = '';
      this.refreshToken = '';
      this.tokenExpiry = null;
      this.refreshTokenExpiry = null;
    },
    setJwtToken(payload: SetJwtTokenPayload) {
      this.jwt = payload.jwt;

      // Set refresh token if provided
      if (payload.refreshToken) {
        this.refreshToken = payload.refreshToken;
      }

      // Set expiration times if provided (from backend response)
      if (payload.accessExpiresIn) {
        this.tokenExpiry = Date.now() + payload.accessExpiresIn * 1000;
      }
      if (payload.refreshExpiresIn) {
        this.refreshTokenExpiry = Date.now() + payload.refreshExpiresIn * 1000;
      }

      // Fallback: Extract expiration from JWT if not provided by backend
      if (!payload.accessExpiresIn && payload.jwt) {
        try {
          const parts = payload.jwt.split('.');
          if (parts.length === 3 && parts[1]) {
            const decoded = JSON.parse(atob(parts[1]));
            this.tokenExpiry = decoded.exp ? decoded.exp * 1000 : null;
          }
        } catch (error) {
          console.error('Failed to decode JWT:', error);
          this.tokenExpiry = null;
        }
      }
    },
  },
  persist: {
    // Only persist non-sensitive data (exclude jwt token)
    storage: localStorage,
    pick: ['userName'],
  },
});

export default useYakStore;
