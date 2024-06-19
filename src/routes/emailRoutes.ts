import express from "express";
import multer from "multer";
import { enviarEmail, testarEmail } from "../services/emailService";
import { storage } from "../config/storage";

const upload = multer({ storage: storage });
const router = express.Router();

router.post("/enviarEmail", upload.array("anexos"), enviarEmail);
router.post("/testarEmail", upload.none(), testarEmail);

export default router;

