import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from 'fs;
const app = express();

app.use(express.json({ limit: "1mb" })); 
app.use(express.urlencoded({ limit: "1mb", extended: true }));

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Especifique o diretório onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    // Preserve o nome original do arquivo e adicione um timestamp para evitar colisões de nome
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/sendEmail", upload.single("anexo"), async (req, res) => {
  try {
    const emailRemetente = req.body.emailRemetente;
    const emailDestinatario = req.body.emailDestinatario;
    const senderPassword = req.body.senderPassword;
    const assunto = req.body.assunto;
    const mensagem = req.body.mensagem;
    const anexo = req.file; // Acesso ao arquivo enviado

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailRemetente,
        pass: senderPassword,
      },
    });

    if (anexo) {
      const mailOptions = {
        from: emailRemetente,
        to: emailDestinatario,
        subject: assunto,
        text: mensagem,
        attachments: [
          {
            filename: anexo.originalname,
            path: anexo.path, // Usa o caminho do arquivo original
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      // Exclui o arquivo após o envio do e-mail
      fs.unlinkSync(anexo.path);
    } else {
      const mailOptions = {
        from: emailRemetente,
        to: emailDestinatario,
        subject: assunto,
        text: mensagem,
      };

      await transporter.sendMail(mailOptions);
    }

    res.send("OK!");
  } catch (erro) {
    console.log("Erro", erro);
    res.status(500).send("Erro ao enviar e-mail");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
