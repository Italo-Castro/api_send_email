import express from "express";
import { config } from "dotenv";
import emailRoutes from "./routes/emailRoutes";

config(); 

const app = express();

app.use(express.json({ limit: process.env.LIMIT_JSON }));
app.use(express.urlencoded({ limit: process.env.LIMIT_URL_ENCODED, extended: true }));

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Executando");
});

app.use(emailRoutes);

app.listen(port, () => {
  console.log(`Executando na porta: ${port}`);
});
