<template>
    <div class="room">
        <h1>Room</h1>
        <h3>List of people: </h3>
        <div v-for="usuari in totalUsuaris" class="usuari">
            <p v-if="usuari.nom === nom" class="nom-propi">{{ usuari.nom }}</p>
            <p v-else>{{ usuari.nom }}</p>
            <button v-if="usuari.nom !== nom" @click="connectarAmbUsuari(usuari.id)">Connectar</button>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '../stores/app';
import { socket } from '@/socket';
// import { peer } from '@/communicationManager.js';

export default {

    data() {
        return {
            store: useAppStore()
        }
    },

    computed: {
        totalUsuaris() {
            return this.store.getUsuaris();
        },
        nom() {
            return this.store.getNom();
        }
    },

    methods: {
        connectarAmbUsuari(id) {
            const peer = new SimplePeer({ initiator: true })
            console.log("Peer creat: ", peer)
            console.log("Connectant amb usuari: ", id);

            peer.on('signal', data => {
                // Here you might want to send `data` to the other peer
                // For example, you could use your existing store:
                console.log("Signal received: ", data)
                socket.emit('connectar-amb-usuari', id, data);
                // this.store.setUsuariSeleccionat(id, data);
            });

            // When you receive the signal data from the other peer, you can use it to connect:
            // peer.signal(otherPeerData);

            // You might also want to handle errors:
            peer.on('error', err => console.error(err));


            // store.setUsuariSeleccionat(id);
            // this.$router.push('/xat');
        }
    }

}

</script>
  
<style scoped>
.room {
    width: 100%;
}

.usuari {
    display: flex;
    width: 200px;
    justify-content: space-between;
}

.nom-propi {
    color: darkblue;
}
</style>
  