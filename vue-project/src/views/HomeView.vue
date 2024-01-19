<template>
  <main v-if="pagina === 'home'">
    <form @submit.prevent="entrarSala" class="form">
      <h1>Enter your name</h1>
      <input type="text" v-model="nom" placeholder="Enter your name" required>
      <button type="submit">Enter the room</button>
    </form>
  </main>
  <div class="room" v-if="pagina === 'room'">
    <h1>Room</h1>
    <h3>List of people: </h3>
    <div v-for="usuari in totalUsuaris" class="usuari">
      <p v-if="usuari.nom === nom" class="nom nom-propi">{{ usuari.nom }}</p>
      <p v-else class="nom">{{ usuari.nom }}</p>
      <button v-if="usuari.nom !== nom" @click="connectarAmbUsuari(usuari.id)">Connectar</button>
    </div>
  </div>
</template>


<script>
import { communicationManager } from '@/communicationManager.js';
import { useAppStore } from '@/stores/app';
import { socket } from '@/socket';
import { watch } from 'vue';

export default {

  data() {
    return {
      store: useAppStore(),
      nom: '',
      peer: null,
    }
  },

  computed: {
    totalUsuaris() {
      return this.store.getUsuaris();
    },
    pagina() {
      return this.store.getPagina();
    },
  },

  mounted() {
    watch(
      () => this.store.peticioRebuda,
      (newVal, oldVal) => {
        // Cuando se recibe una petición, se crea un peer como no iniciador
        // Se genera una señal de respuesta que se envía al servidor
        let peer = communicationManager.newNonInitiatorPeer();
        console.log("Peer: ", peer)
        peer.signal(newVal.data)
        communicationManager.setAnswerSignal(newVal.socketId);
      }
    );
    watch(
      () => this.store.respostaRebuda,
      (newVal, oldVal) => {
        console.log("Ara s'establirà la connexió: ")
        // Cuando se recibe una respuesta, se establece la conexión
        let peer = communicationManager.getPeer();
        peer.signal(newVal.data)
        communicationManager.setConnectionEstablished();
      }
    );
  },

  methods: {
    entrarSala() {
      this.store.setNom(this.nom);
      this.store.setPagina('room');
      socket.emit('entrar-sala', this.nom);
    },
    connectarAmbUsuari(id) {
      // Cuando se quiere conectar con un usuario, se crea un peer como iniciador
      // Al ser iniciador, se genera un signal que se envía al servidor
      let peer = communicationManager.newInitiatorPeer();
      console.log("Connectant amb usuari: ", id);
      communicationManager.setOfferSignal(id);
    }
  }
}
</script>


<style scoped>
* {
  font-family: sans-serif;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.room {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.usuari {
  display: flex;
  width: 200px;
  border: 2px solid grey;
  padding: 15px;
  border-radius: 8px;
  justify-content: space-between;
}

.nom {
  font-size: 1.2rem;
}

.nom-propi {
  color: darkgreen;
}
</style>
  