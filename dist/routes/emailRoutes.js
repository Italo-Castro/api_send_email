"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const emailService_1 = require("../services/emailService");
const storage_1 = require("../config/storage");
const upload = (0, multer_1.default)({ storage: storage_1.storage });
const router = express_1.default.Router();
router.post("/enviarEmail", upload.array("anexos"), emailService_1.enviarEmail);
router.post("/testarEmail", upload.none(), emailService_1.testarEmail);
exports.default = router;
