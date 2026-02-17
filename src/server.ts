import express from "express";
import http from "http";
import cookieParser from 'cookie-parser'
import { Server } from "socket.io";

import { createPoll } from "./http/routes/create-poll";
import { getPoll } from "./http/routes/get-poll";
import { voteOnPoll } from "./http/routes/vote-on-poll";

const app = express();
app.use(express.json());
app.use(cookieParser('polls-api'))

app.use(createPoll);
app.use(getPoll);
app.use(voteOnPoll);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

export { server, io }

