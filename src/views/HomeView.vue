<template>
  <div class="home-container">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" 
      alt="Pokémon Logo" 
      class="logo"
    />

    <section class="titles">
      <h2>¿Eres el mejor maestro Pokémon del mundo?</h2>
      <p>¡Encuentra todos los pokémons ocultos y demuéstralo!</p>
    </section>

    <section class="instructions">
      <h3>Instrucciones</h3>
      <p>
        Para mostrar al pokémon detrás del Ditto, da click en el pokémon deseado.
        Después elige otra opción para encontrar el par. Una vez que hayas encontrado todos los pares, el juego te mostrará tu puntaje.
      </p>
    </section>

    <div class="form-section">
      <label for="username">Nombre de usuario:</label>
      <input 
        v-model="userName" 
        type="text" 
        id="username" 
        placeholder="Username"
      />
    </div>

    <div v-if="userName" class="form-section">
      <label>Selecciona una Región:</label>
      <div class="button-group">
        <button 
          v-for="region in regions" 
          :key="region" 
          @click="setRegion(region)" 
          :class="{ selected: gameRegion === region }"
        >
          {{ region }}
        </button>
      </div>
    </div>

    <div v-if="userName && gameRegion" class="form-section">
      <label>Selecciona Dificultad:</label>
      <div class="button-group">
        <button 
          v-for="option in options" 
          :key="option" 
          @click="setDifficulty(option)" 
          :class="{ selected: gameDifficulty === option }"
        >
          {{ option }}
        </button>
      </div>
    </div>
    
    <button 
      class="start-button"
      @click="startGame"
      v-if="userName && gameRegion && gameDifficulty && auth.authToken"    
    >
      ¡Comenzar Juego!
    </button>
  </div>
</template>

<script setup>
import router from "@/router/index.js";
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useGameStore } from '@/stores/game.js';
import { authStore } from '@/stores/auth.js'

const gameStore = useGameStore();
const auth = authStore();

const regions = ref([]);
const userName = ref('');
const gameRegion = ref('');
const gameDifficulty = ref('');
const options = ['Facil', 'Medio', 'Dificil'];

const startGame = () => {
  gameStore.setUserName(userName.value);
  gameStore.setRegion(gameRegion.value);
  gameStore.setDifficulty(gameDifficulty.value);
  router.push({ name: 'game' });
};

const setRegion = (choice) => gameRegion.value = choice;
const setDifficulty = (choice) => gameDifficulty.value = choice;

const getUser = async () => {
  const response = await axios.post('http://localhost:5173/get-user');
  if (response?.data?.authToken) auth.setAuthToken(response.data.authToken);
};

const getRegions = async () => {
  try {
    const response = await axios.get('http://localhost:5173/get-regions');
    if (response?.data?.regions) regions.value = response.data.regions;
  } catch (error) {
    console.error('Error al obtener regiones', error);
  }
};

onMounted(() => {
  getUser();
  getRegions();
});
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

.home-container {
  max-width: 850px;
  margin: auto;
  padding: 40px 20px;
  text-align: center;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.logo {
  width: 75%;
  max-width: 320px;
  margin-bottom: 25px;
}

.titles h2 {
  font-size: 28px;
  color: #007BFF;
  margin-bottom: 8px;
}

.titles p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.instructions {
  background-color: #eef6ff;
  padding: 20px;
  border-left: 5px solid #007BFF;
  border-radius: 12px;
  margin-bottom: 30px;
}

.instructions h3 {
  font-size: 20px;
  color: #007BFF;
  margin-bottom: 8px;
}

.instructions p {
  font-size: 16px;
  color: #444;
}

.form-section {
  margin: 20px 0;
  text-align: left;
  max-width: 500px;
  margin-inline: auto;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

input[type="text"] {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

button {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #d0d0d0;
}

button.selected {
  background-color: #28a745;
  color: white;
}

.start-button {
  margin-top: 30px;
  background-color: #007BFF;
  color: white;
  font-size: 18px;
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.start-button:hover {
  background-color: #0056b3;
}
</style>
