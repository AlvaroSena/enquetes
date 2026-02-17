import { io } from "./server";
import { voting } from "./utils/voting-pub-sub";

io.on("connection", socket => {
  console.log(socket.id);

  socket.on("pollId", (pollId: string) => {
    console.log("Evento recebido!");
    console.log("POLL ID:", pollId);

    voting.subscribe(pollId, (message) => {
      socket.emit("resposta", JSON.stringify(message));
    });

    // Responde o cliente
    // socket.emit("resposta", "Servidor recebeu sua mensagem!");
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});