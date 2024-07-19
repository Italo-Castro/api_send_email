"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testarEmail = exports.enviarEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const enviarEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { host, port, secure, emailRemetente, emailDestinatario, senderPassword, assunto, mensagem, } = req.body;
        const anexos = req.files || [];
        const transporter = nodemailer_1.default.createTransport({
            host: host,
            port: Number(port),
            secure: secure === "true",
            auth: {
                user: emailRemetente,
                pass: senderPassword,
            },
        });
        yield transporter.verify();
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
        yield transporter.sendMail(mailOptions);
        console.log(`Rem: ${emailRemetente}, Des: ${emailDestinatario}, Anexos: `, anexos);
        anexos.forEach((anexo) => {
            fs_1.default.unlinkSync(anexo.path);
        });
        res.send("Email enviado com sucesso");
    }
    catch (erro) {
        console.log("Erro", erro);
        res.status(500).send(`Erro ao enviar e-mail: ${erro}`);
    }
});
exports.enviarEmail = enviarEmail;
const testarEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { host, port, secure, emailRemetente, senderPassword, } = req.body;
        const transporter = nodemailer_1.default.createTransport({
            host: host,
            port: Number(port),
            secure: secure === "true",
            auth: {
                user: emailRemetente,
                pass: senderPassword,
            },
        });
        yield transporter.verify();
        res.status(200).send("Email verificado com sucesso");
    }
    catch (erro) {
        console.log("Erro", erro);
        res.status(500).send(`Erro ao verificar e-mail: ${erro}`);
    }
});
exports.testarEmail = testarEmail;
