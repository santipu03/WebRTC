<template>
    <div class="chat">
      <input type="text" v-model="missatge" placeholder="Type your message here...">
      <button @click="enviarMissatge">Send</button>
    </div>
  </template>
  
  <script>
  import { communicationManager } from '@/communicationManager.js';
  
  export default {
  
    data() {
      return {
        missatge: '',
      }
    },

    mounted() {
      let peer = communicationManager.getPeer();
      peer.on('data', (data) => {
        let dataText = new TextDecoder("utf-8").decode(data);
        console.log("Missatge rebut: ", dataText);
      });
    },
  
    methods: {
        enviarMissatge() {
            let peer = communicationManager.getPeer();
            peer.send(this.missatge);
            this.missatge = '';
        }
    }
  }
  </script>
  
  <style scoped>
  .chat {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  
  .chat input {
    flex-grow: 1;
    margin-right: 10px;
  }
  
  .chat button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  </style>
    