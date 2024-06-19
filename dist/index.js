"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: process.env.LIMIT_JSON }));
app.use(express_1.default.urlencoded({ limit: process.env.LIMIT_URL_ENCODED, extended: true }));
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.send("Executando");
});
app.use(emailRoutes_1.default);
app.listen(port, () => {
    console.log(`Executando na porta: ${port}`);
});
