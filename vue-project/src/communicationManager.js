import { socket } from '@/socket';
import router from '@/router';
import { useAppStore } from '@/stores/app';

let peer;

function newInitiatorPeer() {
    peer = new SimplePeer({ initiator: true, trickle: false });
    return peer
}

function newNonInitiatorPeer() {
    peer = new SimplePeer({ initiator: false, trickle: false });
    return peer;
}

function getPeer() {
    return peer;
}

function setOfferSignal(id) {
    peer.on('signal', data => {
        // Aqui se envía el signal al servidor
        if (data.type === 'offer') {
            console.log("S'ha generat i enviat la oferta de Chat: ", data)
            socket.emit('peticio-enviada', id, data);
        }
    });
}

function setAnswerSignal(id) {
    peer.on('signal', data => {
        // Aqui se envía el signal al servidor
        if (data.type === 'answer') {
            console.log("S'ha generat i enviat la resposta de Chat: ", data)
            socket.emit('resposta-rebuda', id, data);
        }
    });
    setConnectionEstablished();
}

function setConnectionEstablished() {
    peer.on('connect', () => {
        console.log("S'ha establert la connexió amb l'altre usuari");
        const store = useAppStore();
        store.setConnectat(true);
        router.push({ name: 'chat' });
    });
}

const communicationManager = {
    newInitiatorPeer,
    newNonInitiatorPeer,
    getPeer,
    setAnswerSignal,
    setOfferSignal,
    setConnectionEstablished
}

export { communicationManager };