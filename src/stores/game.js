
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {//Store que sirve para almacenar y guardar los datos (enlistados) con esa estructura y manejar el estado del juego
  state: () => {            
    return {
      userName: "",         //Define el estado inicial del juego:
      region: "",
      difficulty: "",
      counter: 0,
      time: 0
    }
  },
  getters: {
    getUserName(state) {
      return state.userName;
    },
    getRegion(state) {
      return state.region;
    },
    getDifficulty(state) {
      return state.difficulty;
    },
    getTime(state) {
      return state.time;
    }
  },
  actions: {
    setUserName(userName) {
      this.userName = userName;
    },
    setRegion(region) {
      this.region = region;
    },
    setDifficulty(difficulty) {
      this.difficulty = difficulty;
    },
    increment() {
      this.counter++;
    },
    setTime(seconds) {
      this.time = seconds;
    },


    saveCurrentScore() {
      const results = JSON.parse(localStorage.getItem('leaderboard') || '{}');
      const difficulty = this.difficulty;
      const region = this.region;

      if (!results[difficulty]) results[difficulty] = {};
      if (!results[difficulty][region]) results[difficulty][region] = [];

      results[difficulty][region].push({
        name: this.userName,
        score: this.counter,
        time: this.time,
        date: new Date().toISOString()
      });


      localStorage.setItem('leaderboard', JSON.stringify(results));
    },
    resetGame() {
      const savedUserName = this.userName;
      const savedRegion = this.region;
      const savedDifficulty = this.difficulty;

      this.counter = 0;
      this.time = 0;
      this.userName = savedUserName;   //Guarda el usuario, región y dificultad para que no se pierdan al reiniciar el juego
      this.region = savedRegion;
      this.difficulty = savedDifficulty;
    }
  }
});
