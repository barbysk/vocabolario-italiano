const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const deepl = require("deepl-node");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

app.post("/traducir", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({
        error: "No se recibió ningún texto",
      });
    }

    const resultado = await translator.translateText(
      texto,
      "IT",
      "ES"
    );

    res.json({
      traduccion: resultado.text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al traducir",
    });
  }
});

app.listen(3001, () => {
  console.log("Servidor iniciado en http://localhost:3001");
});