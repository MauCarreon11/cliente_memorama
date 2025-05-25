<template>
  <div class="card" @click="emit('flip', card)">
    <img
      :src="card.flipped ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
                         : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'"
    />
  </div>
</template>

<script setup>
const props = defineProps(['card']);
const emit = defineEmits(['flip']);
</script>

<style scoped>
.card {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
  cursor: pointer;
}
img {
  width: 80px;
  height: 80px;
}
</style>
