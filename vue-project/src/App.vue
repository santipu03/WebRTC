<template>
  <!-- <RouterView /> -->
  <main v-if="pagina === 'home'">
    <form @submit.prevent="entrarSala" class="form">
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
import { RouterView } from 'vue-router'
// import { peer } from '@/communicationManager.js';
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
        this.peer = new SimplePeer({ initiator: false })
        console.log("Peer: ", this.peer)
        this.peer.signal(newVal.data)
        this.peer.on('signal', data => {
        console.log("Answer received: ", data)
        if(data.type === 'answer') {
          socket.emit('resposta-rebuda', newVal.socketId, data);
        }
      });
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
      this.peer = new SimplePeer({ initiator: true })
      console.log("Peer creat: ", this.peer)
      console.log("Connectant amb usuari: ", id);

      this.peer.on('signal', data => {
        // Here you might want to send `data` to the other peer
        // For example, you could use your existing store:
        console.log("Signal received: ", data)
        socket.emit('connectar-amb-usuari', id, data);
        // this.store.setUsuariSeleccionat(id, data);
      });

      this.peer.on('error', err => console.error(err));

      this.peer.on('connect', () => {
        console.log('CONNECT')
        p.send('whatever' + Math.random())
      })

      this.peer.on('data', data => {
        console.log('data: ' + data)
      })

    }

  }
}
</script>


<style scoped>

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
  