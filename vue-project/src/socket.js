import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
import router from "./router";

let url = "http://localhost:3000";

export const socket = io(url);

socket.on("connect", () => {
  const pinia = useAppStore();

  socket.on("actualitzar-usuaris", (usuaris) => {
    pinia.setUsuaris(usuaris);
  })

  socket.on("connectar-amb-usuari", (data) => {
    pinia.setNom(data.nom);
    router.push({ name: "Chat" });
  });

});