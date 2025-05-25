import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', { //////
  state: () => ({
    name: '',
    region: '',
    difficulty: '',
    token: '',
    score: 0,
  }),
  actions: {
    setPlayer(name, token) {
      this.name = name;
      this.token = token;
    },
    setGameSettings(region, difficulty) {
      this.region = region;
      this.difficulty = difficulty;
    },
    setScore(score) {
      this.score = score;
    },
  },
});
