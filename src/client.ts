import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

socket.on("connect", () => {
  console.log("Conectado ao servidor!");
  console.log("ID:", socket.id);

  // Envia evento para o servidor
  socket.emit("pollId", "a2e74961-bfea-4687-b6c0-8d232a6500f8");
});

socket.on("resposta", (data: string) => {
  console.log("Resposta do servidor:");
  console.log(data);
});

socket.on("disconnect", () => {
  console.log("Desconectado do servidor");
});
