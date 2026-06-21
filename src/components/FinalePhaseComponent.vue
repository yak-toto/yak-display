<template>
  <div class="finale-phase">
    <h1 class="page-title" v-if="phase?.description">{{ phase.description }}</h1>

    <!-- Round selector tabs -->
    <div class="round-tabs" v-if="groups.length">
      <button
        v-for="(group, idx) in groups"
        :key="group.id"
        class="round-tab"
        :class="{ active: idx === activeIndex }"
        @click="activeIndex = idx"
      >
        {{ group.description }}
      </button>
    </div>

    <!-- Bracket -->
    <form @submit.prevent>
      <div class="bracket-wrapper">
        <button type="button" class="nav-btn" @click="prev" :disabled="activeIndex === 0">‹</button>

        <div class="bracket-columns">
          <div
            v-for="(group, gIdx) in groups"
            :key="group.id"
            class="bracket-column"
            :class="{
              'is-active': gIdx === activeIndex,
              'is-prev': gIdx === activeIndex - 1,
              'is-next': gIdx === activeIndex + 1,
            }"
          >
            <div class="column-header">{{ group.description }}</div>
            <div class="column-matches">
              <div
                v-for="(bet, betIdx) in finalePhaseBet[group.id] || []"
                :key="bet.id"
                class="match-wrapper"
                :style="{ minHeight: matchHeight(gIdx) + 'px' }"
              >
                <div class="match-card">
                  <!-- Team 1 -->
                  <div
                    class="match-team"
                    :class="{
                      winner: bet.is_one_won === true,
                      loser: bet.is_one_won === false,
                      empty: !bet.team1?.description,
                    }"
                  >
                    <template v-if="bet.team1?.description">
                      <a
                        v-if="!isLocked"
                        class="team-name"
                        @click="pushBet(gIdx, betIdx, bet.team1, true)"
                      >&#8205;{{ bet.team1.description }}</a>
                      <span v-else class="team-name">&#8205;{{ bet.team1.description }}</span>
                    </template>
                    <span v-else class="team-name team-name--empty">—</span>
                    <span class="tick tick--win" v-if="bet.is_one_won === true">✓</span>
                    <span class="tick tick--loss" v-else-if="bet.is_one_won === false">✗</span>
                  </div>

                  <div class="match-divider"></div>

                  <!-- Team 2 -->
                  <div
                    class="match-team"
                    :class="{
                      winner: bet.is_one_won === false,
                      loser: bet.is_one_won === true,
                      empty: !bet.team2?.description,
                    }"
                  >
                    <template v-if="bet.team2?.description">
                      <a
                        v-if="!isLocked"
                        class="team-name"
                        @click="pushBet(gIdx, betIdx, bet.team2, false)"
                      >&#8205;{{ bet.team2.description }}</a>
                      <span v-else class="team-name">&#8205;{{ bet.team2.description }}</span>
                    </template>
                    <span v-else class="team-name team-name--empty">—</span>
                    <span class="tick tick--win" v-if="bet.is_one_won === false">✓</span>
                    <span class="tick tick--loss" v-else-if="bet.is_one_won === true">✗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="nav-btn"
          @click="next"
          :disabled="activeIndex === groups.length - 1"
        >›</button>
      </div>

      <div class="submit-row">
        <StatusButton
          :disabled="isLocked"
          :on-submit="putFinalePhaseBet"
          default-text="Valider"
          loading-text="Envoi en cours..."
          success-text="Résultats soumis"
          error-text="Erreur de synchronisation"
          info-text="Aucun changement"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { clone, cloneDeep } from 'lodash';
import { ref } from 'vue';
import type {
  BinaryBetWithGroupIdOut,
  GroupWithPhaseIdOut,
  ModifyBinaryBetIn,
  PhaseOut,
  TeamWithWonOut,
} from '@/client';
import {
  executeRuleApiV1RulesRuleIdPost,
  modifyBinaryBetByIdApiV1BinaryBetsBetIdPatch,
  retrieveBetsByPhaseCodeApiV1BetsPhasesPhaseCodeGet,
} from '@/client';
import StatusButton from './form/StatusButton.vue';

type BinaryBetOutExtended = BinaryBetWithGroupIdOut & { is_one_won?: boolean | null };

const finalePhaseBet = ref<Record<string, BinaryBetOutExtended[]>>({});
const finalePhaseBetCopy = ref<Record<string, BinaryBetOutExtended[]>>({});
const groups = ref<GroupWithPhaseIdOut[]>([]);
const phase = ref<PhaseOut>({} as PhaseOut);
const isLocked = ref(false);
const activeIndex = ref(0);

const BASE_MATCH_HEIGHT = 72;

const matchHeight = (gIdx: number) => BASE_MATCH_HEIGHT * 2 ** gIdx;

const prev = () => {
  if (activeIndex.value > 0) activeIndex.value--;
};
const next = () => {
  if (activeIndex.value < groups.value.length - 1) activeIndex.value++;
};

const getFinalePhase = async () => {
  await executeRuleApiV1RulesRuleIdPost({
    path: { rule_id: '492345de-8d4a-45b6-8b94-d219f2b0c3e9' },
  });

  const { data: res } = await retrieveBetsByPhaseCodeApiV1BetsPhasesPhaseCodeGet({
    path: { phase_code: 'FINAL' },
  });

  if (res?.result) {
    phase.value = res.result.phase;
    groups.value = (res.result.groups as unknown as GroupWithPhaseIdOut[]).filter(
      (group) => group.code !== '3',
    );

    for (const group of groups.value) {
      finalePhaseBet.value[group.id] = [];
    }

    for (const binaryBet of res.result.binary_bets) {
      let is_one_won: boolean | null = null;

      if (!(binaryBet.team1 === null && binaryBet.team2 === null)) {
        if (binaryBet.team1 === null) {
          is_one_won = binaryBet.team2?.won ?? null;
          is_one_won = is_one_won === null ? null : !is_one_won;
        } else if (binaryBet.team2 === null) {
          is_one_won = binaryBet.team1?.won ?? null;
        } else {
          is_one_won = binaryBet.team1?.won ?? null;
        }
      }

      const team1: typeof binaryBet.team1 = binaryBet.team1 || {
        id: '',
        code: '',
        description: '',
        flag: { url: '' },
        won: null,
      };
      const team2: typeof binaryBet.team2 = binaryBet.team2 || {
        id: '',
        code: '',
        description: '',
        flag: { url: '' },
        won: null,
      };

      const extendedBet: BinaryBetOutExtended = {
        id: binaryBet.id,
        locked: binaryBet.locked,
        group: binaryBet.group,
        team1,
        team2,
        is_one_won,
      };

      if (binaryBet.locked) {
        isLocked.value = true;
      }

      const groupId = extendedBet.group?.id;
      if (groupId && finalePhaseBet.value[groupId]) {
        finalePhaseBet.value[groupId]?.push(extendedBet);
      }
    }

    if (res.result.binary_bets.length === 0) {
      isLocked.value = true;
    }

    finalePhaseBetCopy.value = cloneDeep(finalePhaseBet.value);
  }
};

const pushBet = (
  groupIndex: number,
  betIndex: number,
  team: TeamWithWonOut | null | undefined,
  isOneWon: boolean,
) => {
  const groupId = groups.value[groupIndex]?.id;
  const nextGroupId = groups.value[groupIndex + 1]?.id;

  if (!groupId) return;

  const bet = finalePhaseBet.value[groupId]?.[betIndex];
  if (!bet) return;

  bet.is_one_won = isOneWon;

  if (!nextGroupId) return;

  const teamIndex = betIndex % 2 === 0 ? 1 : 2;
  const newBetIndex = betIndex % 2 === 0 ? betIndex / 2 : (betIndex - 1) / 2;
  const nextBets = finalePhaseBet.value[nextGroupId];
  if (!nextBets?.[newBetIndex]) return;

  const originalTeamDescription = nextBets[newBetIndex][`team${teamIndex}`]?.description;
  nextBets[newBetIndex][`team${teamIndex}`] = clone(team);

  for (const group of groups.value.slice(groupIndex + 2)) {
    if (!group.id) continue;
    const bets = finalePhaseBet.value[group.id];
    if (!bets) continue;
    for (const b of bets) {
      if (b.team1 && b.team1.description === originalTeamDescription) {
        b.team1.description = '';
      }
      if (b.team2 && b.team2.description === originalTeamDescription) {
        b.team2.description = '';
      }
    }
  }
};

const putFinalePhaseBet = async (): Promise<'success' | 'error' | 'info'> => {
  const newBets = Object.values(finalePhaseBet.value)
    .flat()
    .sort((a, b) => (a.id || '').localeCompare(b.id || ''));
  const originalBets = Object.values(finalePhaseBetCopy.value)
    .flat()
    .sort((a, b) => (a.id || '').localeCompare(b.id || ''));

  let anyUpdateRequired = false;

  try {
    for (let i = 0; i < newBets.length; i++) {
      const newBet = newBets[i];
      const originalBet = originalBets[i];
      if (!newBet || !originalBet) continue;

      const requestBody: ModifyBinaryBetIn = {};
      let isUpdateRequired = false;

      if (newBet.team1?.id !== originalBet.team1?.id) {
        isUpdateRequired = true;
        requestBody.team1 = { id: newBet.team1?.id };
      }
      if (newBet.team2?.id !== originalBet.team2?.id) {
        isUpdateRequired = true;
        requestBody.team2 = { id: newBet.team2?.id };
      }
      if (newBet.is_one_won !== originalBet.is_one_won) {
        isUpdateRequired = true;
        requestBody.is_one_won = newBet.is_one_won;
      }

      if (isUpdateRequired) {
        anyUpdateRequired = true;
        await modifyBinaryBetByIdApiV1BinaryBetsBetIdPatch({
          path: { bet_id: newBet.id },
          body: requestBody,
        });
      }
    }

    if (!anyUpdateRequired) return 'info';

    finalePhaseBetCopy.value = cloneDeep(finalePhaseBet.value);
    return 'success';
  } catch (error) {
    console.error('Failed to update bets:', error);
    return 'error';
  }
};

getFinalePhase();
</script>

<style scoped lang="css">
.finale-phase {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #37352f;
}

/* ── Round tabs ── */
.round-tabs {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.round-tab {
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  color: #9b9a97;
  background: none;
  border: 1px solid #e9e9e7;
  border-radius: 4px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.round-tab:hover {
  background-color: #f7f6f3;
  color: #37352f;
}

.round-tab.active {
  background-color: #37352f;
  border-color: #37352f;
  color: #ffffff;
}

/* ── Bracket wrapper ── */
.bracket-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.nav-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e9e9e7;
  background: #ffffff;
  font-size: 1.2rem;
  line-height: 1;
  color: #37352f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.5rem;
  transition: background-color 0.15s ease;
}

.nav-btn:hover:not(:disabled) {
  background-color: #f7f6f3;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* ── Bracket columns ── */
.bracket-columns {
  flex: 1;
  display: flex;
  gap: 0.5rem;
  min-width: 0;
  overflow: hidden;
}

/* Mobile: only active column visible */
.bracket-column {
  display: none;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.bracket-column.is-active {
  display: flex;
}

/* Desktop: show active + prev + next */
@media screen and (min-width: 640px) {
  .bracket-column.is-prev,
  .bracket-column.is-next {
    display: flex;
  }
}

/* Wide desktop: show all */
@media screen and (min-width: 1024px) {
  .bracket-columns {
    overflow: visible;
  }
  .bracket-column {
    display: flex;
  }
}

.column-header {
  font-size: 0.78rem;
  font-weight: 600;
  color: #9b9a97;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0 0.25rem 0.75rem;
  white-space: nowrap;
}

/* ── Match items ── */
.column-matches {
  display: flex;
  flex-direction: column;
}

.match-wrapper {
  display: flex;
  align-items: center;
}

.match-card {
  width: 100%;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  overflow: hidden;
}

.match-team {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.65rem;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #37352f;
  transition: background-color 0.1s ease;
}

.match-team.winner {
  font-weight: 600;
}

.match-team.loser {
  color: #9b9a97;
}

.match-team.empty {
  color: #c7c6c3;
}

.team-name {
  flex: 1;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: block;
}

.team-name--empty {
  cursor: default;
}

a.team-name:hover {
  text-decoration: underline;
}

.tick {
  font-size: 0.8rem;
  flex-shrink: 0;
}

.tick--win {
  color: #0f7b0f;
}

.tick--loss {
  color: #d44c47;
}

.match-divider {
  height: 1px;
  background-color: #e9e9e7;
}

/* ── Submit ── */
.submit-row {
  display: flex;
  justify-content: center;
}
</style>
