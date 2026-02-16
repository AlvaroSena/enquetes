import express from "express";
import cookieParser from 'cookie-parser'
import { createPoll } from "./http/routes/create-poll";
import { getPoll } from "./http/routes/get-poll";
import { voteOnPoll } from "./http/routes/vote-on-poll";

const app = express();
app.use(express.json());

app.use(cookieParser('polls-api'))

app.use(createPoll);
app.use(getPoll);
app.use(voteOnPoll);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});