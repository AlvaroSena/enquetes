import express from "express";
import { createPoll } from "./http/routes/create-poll";

const app = express();
app.use(express.json());

app.use(createPoll);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});