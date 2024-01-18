<template>
  <main>
    <form @submit.prevent="enterRoom" class="form">
      <input type="text" v-model="name" placeholder="Enter your name" required>
      <button type="submit">Enter the room</button>
    </form>
  </main>
</template>

<script>

import { socket } from '@/socket';
import { useAppStore } from '../stores/app'

export default {
  data() {
    return {
      store: useAppStore(),
      name: ''
    }
  },
  methods: {
    enterRoom() {
      this.store.setNom(this.name);
      socket.emit('entrar-sala', this.name);
      this.$router.push('/sala');
    }
  }
}
</script>

<style scoped>

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

</style>

