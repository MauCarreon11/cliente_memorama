<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game.js';

const router = useRouter();
const gameStore = useGameStore();

const numCards = ref(0);   //Variables reactivas
const numColumns = ref(0);
const pokemons = ref([]);
const selectedCards = ref([]);
const isChecking = ref(false);
const isLoading = ref(true);
const showVictoryModal = ref(false);
const showFinishedMessage = ref(false); // ←– Nuevo flag

const difficultyMap = {
  Facil: { cards: 12, columns: 4 },
  Medio: { cards: 20, columns: 5 },
  Dificil: { cards: 30, columns: 6 }
};

const regionRanges = {  //Arreglo de rangos de ID de regiones
  Kanto: [1, 151],
  Johto: [152, 251],
  Hoenn: [252, 386],
  Sinnoh: [387, 493],
  Unova: [494, 649],
  Kalos: [650, 721],
  Alola: [722, 809],
  Galar: [810, 905],
  Paldea: [906, 1025]
};

let timerInterval = null;
const elapsedTime = ref(0); // tiempo en segundos

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const initTimer = () => {
  elapsedTime.value = 0;
  timerInterval = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
};

const initBoard = async () => {
  isLoading.value = true;

  const difficulty = gameStore.difficulty;
  const region = gameStore.region;
  const user = gameStore.userName;

  if (!difficulty || !region || !user) {
    router.push({ name: 'home' });
    return;
  }

  const config = difficultyMap[difficulty];
  numCards.value = config.cards;
  numColumns.value = config.columns;

  const [minId, maxId] = regionRanges[region];
  const pairsNeeded = numCards.value / 2;
  const tempPairs = [];

  for (let i = 0; i < pairsNeeded; i++) {
    const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      const sprite = data.sprites.front_default;

      tempPairs.push({ sprite, revealed: false, matched: false });
      tempPairs.push({ sprite, revealed: false, matched: false });
    } catch (err) {
      console.error(err);
    }
  }

  pokemons.value = shuffleArray(tempPairs);
  isLoading.value = false;

  initTimer();
};

const shuffleArray = (array) => {
  return array
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const checkWinCondition = () => {
  const allMatched = pokemons.value.every(p => p.matched);
  if (allMatched) {
    stopTimer();
    gameStore.setTime(elapsedTime.value);
    gameStore.saveCurrentScore();
    showVictoryModal.value = true;
    showFinishedMessage.value = true; // ←– Activar el mensaje
  }
};

const goToLeaderboard = () => {
  router.push({ name: 'leaderboard' });
};

const revealPokemon = (index) => {
  const card = pokemons.value[index];
  if (card.revealed || card.matched || isChecking.value) return;

  card.revealed = true;
  selectedCards.value.push({ ...card, index });

  if (selectedCards.value.length === 2) {
    gameStore.increment();
    isChecking.value = true;

    const [first, second] = selectedCards.value;

    if (first.sprite === second.sprite) {
      pokemons.value[first.index].matched = true;
      pokemons.value[second.index].matched = true;
      selectedCards.value = [];
      isChecking.value = false;
      checkWinCondition();
    } else {
      setTimeout(() => {
        pokemons.value[first.index].revealed = false;
        pokemons.value[second.index].revealed = false;
        selectedCards.value = [];
        isChecking.value = false;
      }, 1000);
    }
  }
};

onMounted(() => {
  initBoard();
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <div class="container">
    <h2 class="title">Jugador: {{ gameStore.userName }}</h2>
    <h3 class="subtitle">
      Región: {{ gameStore.region }} - Dificultad: {{ gameStore.difficulty }} 
    </h3>
    <h3 class="timer">Tiempo: {{ formatTime(elapsedTime) }}</h3>

    <div v-if="isLoading" class="loading">Cargando tarjetas...</div>

    <div 
      class="grid"
      :style="`grid-template-columns: repeat(${numColumns}, 1fr)`"
    >
      <div 
        v-for="(pokemon, index) in pokemons" 
        :key="index" 
        @click="revealPokemon(index)" 
        class="card"
        :class="{ revealed: pokemon.revealed || pokemon.matched }"
      >
        <img 
          v-if="pokemon.revealed || pokemon.matched" 
          :src="pokemon.sprite" 
          alt="pokemon" 
        />
        <img 
          v-else 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png" 
          alt="Ditto oculto" 
        />
      </div>
    </div>

    <!-- Mensaje de finalización -->
    <p v-if="showFinishedMessage" class="finished-message">¡Juego Terminado!</p>

    <div class="summary">
      <p><strong>Puntaje:</strong> {{ gameStore.counter }}</p>
      <p><strong>Jugador:</strong> {{ gameStore.userName }}</p>
      <p><strong>Dificultad:</strong> {{ gameStore.difficulty }}</p>
      <button class="modal-button" @click="goToLeaderboard">
        Ver tabla de posiciones
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 960px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f9f9fb;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(41, 41, 42, 0.12);
  text-align: center;
  color: #1e293b;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0.2rem;
}

.subtitle {
  font-weight: 500;
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 1rem;
}

.timer {
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #2563eb;
  font-family: 'Courier New', Courier, monospace;
}

.loading {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  gap: 18px;
  justify-content: center;
  max-width: 100%;
}

.card {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: transform 0.2s ease, background-color 0.3s ease;
}
.card:hover {
  transform: scale(1.07);
}
.card.revealed {
  background-color: #e0f2fe;
}

img {
  width: 96px;
  height: 96px;
  user-select: none;
}

/* Nuevo estilo para el mensaje */
.finished-message {
  color: #16a34a; /* verde */
  font-size: 1.4rem;
  font-weight: bold;
  margin-top: 1.2rem;
}

.summary {
  margin-top: 2rem;
  padding: 1.2rem;
  background-color: #e0f2fe;
  border-radius: 12px;
  color: #1e293b;
  font-size: 1.1rem;
}

.modal-button {
  background-color: #2563eb;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 16px;
}
.modal-button:hover {
  background-color: #1e40af;
  transform: scale(1.05);
}
</style>
