import { Request, RequestHandler, Response } from "express";
import nodemailer from "nodemailer";
import fs from "fs";

export const enviarEmail = async (req: Request, res: Response): Promise<void> => {


  try {
    const {
      host,
      port,
      secure,
      emailRemetente,
      emailDestinatario,
      senderPassword,
      assunto,
      mensagem,
    } = req.body;
    const anexos = (req as any).files as Express.Multer.File[] || [];


    const transporter = nodemailer.createTransport({
      host: host,
      port: Number(port),
      secure: secure === "true",
      auth: {
        user: emailRemetente,
        pass: senderPassword,
      },
    });

    await transporter.verify();

    const corpoEmail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Título Aqui</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
        .footer .img-footer {
            margin-right: 20px;
        }
        .footer .text-footer {
            flex: 1;
        }
        .footer p {
            margin: 10px 0;
            text-align: left;
            width: 100%;
        }
        .footer a {
            color: #333333;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .footer img {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div>
        <p>${mensagem}</p>
    </div>
    <div class="footer">
        <div class="img-footer">
            <img src="https://edilsystem.com.br/site/wp-content/uploads/2021/06/edilsystem-300x152.png" alt="Logo da Edil System Ltda">
        </div>
        <div class="text-footer">
      <p>Enviado pelo ERP Edsys - <a href="http://edilsystem.com.br" target="_blank">Edil System Ltda.</a></p>
      <p>Endereço: Rua Presidente Kennedy, 40, Centro - Formiga, MG</p>
      <p>Telefone: (37) 3322-4339 | WhatsApp: (37) 9 9988-1991</p>
        </div>
    </div>
</body>
</html>
`;

    const mailOptions = {
      from: emailRemetente,
      to: emailDestinatario,
      subject: assunto,
      text: mensagem,
      html: corpoEmail,
      attachments: anexos.map((anexo) => ({
        filename: anexo.originalname,
        path: anexo.path,
      })),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Rem: ${emailRemetente}, Des: ${emailDestinatario}, Anexos: `,anexos)


    anexos.forEach((anexo) => {
      fs.unlinkSync(anexo.path);
    });

    res.send("Email enviado com sucesso");
  } catch (erro) {
    console.log("Erro", erro);
    res.status(500).send(`Erro ao enviar e-mail: ${erro}`);
  }
};

export const testarEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      host,
      port,
      secure,
      emailRemetente,
      senderPassword,
    } = req.body;

    const transporter = nodemailer.createTransport({
      host: host,
      port: Number(port),
      secure: secure === "true",
      auth: {
        user: emailRemetente,
        pass: senderPassword,
      },
    });

    await transporter.verify();
    res.status(200).send("Email verificado com sucesso");
  } catch (erro) {
    console.log("Erro", erro);
    res.status(500).send(`Erro ao verificar e-mail: ${erro}`);
  }
};
