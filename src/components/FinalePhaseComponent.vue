<template>
  <NavbarLayout>
    <div class="table-finale-phase">
      <h3 class="title" v-if="phase">{{ phase.description }}</h3>

      <div class="box-group">
        <form @submit.prevent>
          <table class="table-final-phase">
            <thead>
              <tr>
                <th v-for="group of groups" :key="group.id">{{ group.description }}</th>
              </tr>
            </thead>
            <tbody v-if="groups.length !== 0 && groups[0] && finalePhaseBet[groups[0]!.id]?.length">
              <tr v-for="index in range(finalePhaseBet[groups[0]!.id]?.length || 0)" :key="index">
                <template v-for="[groupIndex, group] in groups.entries()" :key="group.id">
                  <td
                    v-if="
                      group.id &&
                      finalePhaseBet[group.id!]?.[Math.floor(index / Math.pow(2, groupIndex))] &&
                      index % Math.pow(2, groupIndex) === 0
                    "
                    :rowspan="Math.pow(2, groupIndex)"
                  >
                    <div class="box-match">
                      <template
                        v-if="
                          finalePhaseBet[group.id!]?.[Math.floor(index / Math.pow(2, groupIndex))]
                            ?.team1?.description === '' ||
                          finalePhaseBet[group.id!]?.[Math.floor(index / Math.pow(2, groupIndex))]
                            ?.team2?.description === ''
                        "
                      >
                        <div>
                          &#8205;{{
                            finalePhaseBet[group.id!]?.[Math.floor(index / Math.pow(2, groupIndex))]
                              ?.team1?.description
                          }}
                        </div>
                        <hr />
                        <div>
                          &#8205;{{
                            finalePhaseBet[group.id!]?.[Math.floor(index / Math.pow(2, groupIndex))]
                              ?.team2?.description
                          }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="box-team">
                          <div v-if="isLocked">
                            &#8205;{{
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.team1?.description
                            }}
                          </div>
                          <a
                            v-else
                            @click="
                              pushBet(
                                groupIndex,
                                Math.floor(index / Math.pow(2, groupIndex)),
                                finalePhaseBet[group.id!]?.[
                                  Math.floor(index / Math.pow(2, groupIndex))
                                ]?.team1,
                                true,
                              )
                            "
                          >
                            &#8205;{{
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.team1?.description
                            }}
                          </a>
                          <div
                            class="box-match-tick-green"
                            v-if="
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.is_one_won === true
                            "
                          >
                            V
                          </div>
                          <div
                            class="box-match-tick-red"
                            v-else-if="
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.is_one_won === false
                            "
                          >
                            D
                          </div>
                        </div>
                        <hr />
                        <div class="box-team">
                          <div v-if="isLocked">
                            &#8205;{{
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.team2?.description
                            }}
                          </div>
                          <a
                            v-else
                            @click="
                              pushBet(
                                groupIndex,
                                Math.floor(index / Math.pow(2, groupIndex)),
                                finalePhaseBet[group.id!]?.[
                                  Math.floor(index / Math.pow(2, groupIndex))
                                ]?.team2,
                                false,
                              )
                            "
                          >
                            &#8205;{{
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.team2?.description
                            }}
                          </a>
                          <div
                            class="box-match-tick-green"
                            v-if="
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.is_one_won === false
                            "
                          >
                            V
                          </div>
                          <div
                            class="box-match-tick-red"
                            v-else-if="
                              finalePhaseBet[group.id!]?.[
                                Math.floor(index / Math.pow(2, groupIndex))
                              ]?.is_one_won === true
                            "
                          >
                            D
                          </div>
                        </div>
                      </template>
                    </div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
          <div class="div-button-finale-phase">
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
    </div>
  </NavbarLayout>
</template>

<script setup lang="ts">
import { clone, cloneDeep, range } from 'lodash';
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
import NavbarLayout from './NavbarLayout.vue';

type BinaryBetOutExtended = BinaryBetWithGroupIdOut & { is_one_won?: boolean | null };

// Reactive data
const finalePhaseBet = ref<Record<string, BinaryBetOutExtended[]>>({});
const finalePhaseBetCopy = ref<Record<string, BinaryBetOutExtended[]>>({});
const groups = ref<GroupWithPhaseIdOut[]>([]);
const phase = ref<PhaseOut>({} as PhaseOut);
const isLocked = ref(false);

// Methods
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

  if (!groupId || !nextGroupId) {
    return;
  }

  const bet = finalePhaseBet.value[groupId]?.[betIndex];
  if (!bet) {
    return;
  }

  bet.is_one_won = isOneWon;

  const teamIndex = betIndex % 2 === 0 ? 1 : 2;
  const newBetIndex = betIndex % 2 === 0 ? betIndex / 2 : (betIndex - 1) / 2;
  const nextBets = finalePhaseBet.value[nextGroupId];
  if (!nextBets?.[newBetIndex]) {
    return;
  }

  const originalTeamDescription = nextBets[newBetIndex][`team${teamIndex}`]?.description;

  nextBets[newBetIndex][`team${teamIndex}`] = clone(team);

  for (const group of groups.value.slice(groupIndex + 2)) {
    if (!group.id) continue;
    const bets = finalePhaseBet.value[group.id];
    if (!bets) continue;
    for (const bet of bets) {
      if (bet.team1) {
        if (bet.team1.description === originalTeamDescription) {
          bet.team1.description = '';
        }
      }
      if (bet.team2) {
        if (bet.team2.description === originalTeamDescription) {
          bet.team2.description = '';
        }
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

    if (!anyUpdateRequired) {
      return 'info';
    }

    finalePhaseBetCopy.value = cloneDeep(finalePhaseBet.value);
    return 'success';
  } catch (error) {
    console.error('Failed to update bets:', error);
    return 'error';
  }
};

// Equivalent to created() lifecycle hook
getFinalePhase();
</script>

<style scoped lang="css">

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  text-align: center;
}

.box-match {
  border: solid;
  border-width: 1px;
  border-color: #53535321;
  border-radius: 6px;
  color: #535353;
  display: block;
  padding: 0.3rem;
}

.box-team {
  display: flex;
  justify-content: space-between;
}

.box-match-tick-green {
  color: green;
}

.box-match-tick-red {
  color: red;
}

.box-match hr {
  margin: 0px;
  border-color: #53535321;
}

.table-final-phase a {
  cursor: pointer;
  color: black;
  display: block;
  text-decoration: none;
}

.table-final-phase a:hover {
  background-color: #fafafa;
}

.table-final-phase {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.table-final-phase th,
.table-final-phase td {
  border-width: 0 0 1px;
  border-color: #53535321;
  text-align: left;
  padding: 0.5em 0.75em;
}

.table-final-phase abbr {
  cursor: help;
}

.box-group {
  border: solid;
  border-width: 1px;
  border-color: #53535321;
  border-radius: 6px;
  color: #535353;
  display: block;
  padding: 1.25rem;
  width: 100%;
}

.div-button-finale-phase {
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
</style>
