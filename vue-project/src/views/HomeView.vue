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
        // Cuando se recibe una petición, se crea un peer como no iniciador
        // Se genera una señal de respuesta que se envía al servidor
        this.peer = new SimplePeer({ initiator: false })
        console.log("Peer: ", this.peer)
        this.peer.signal(newVal.data)
        this.peer.on('signal', data => {
          if (data.type === 'answer') {
            console.log("S'ha generat i enviat la resposta: ", data)
            socket.emit('resposta-rebuda', newVal.socketId, data);
          }
        });
      }
    );
    watch(
      () => this.store.respostaRebuda,
      (newVal, oldVal) => {
        console.log("Ara s'establirà la connexió: ")
        // Cuando se recibe una respuesta, se establece la conexión
        this.peer.signal(newVal.data)

        this.peer.on('connect', () => {
          console.log('CONNECT')
          this.peer.send('whatever' + Math.random())
          // p.send('whatever' + Math.random())
        })
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
      this.peer = new SimplePeer({ initiator: true })
      console.log("Connectant amb usuari: ", id);

      this.peer.on('signal', data => {
        // Aqui se envía el signal al servidor
        if (data.type === 'offer') {
          console.log("S'ha generat i enviat la oferta de Chat: ", data)
          socket.emit('peticio-enviada', id, data);
        }
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
  