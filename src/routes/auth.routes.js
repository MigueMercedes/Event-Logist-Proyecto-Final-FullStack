import { Router } from "express";
import {
    renderRegistrarForm,
    registrar,
    renderAccederForm,
    acceder,
    salir,
} from "../controllers/auth.controllers.js";

const router = Router();

// Routes
router.get("/auth/registrar", renderRegistrarForm);

router.post("/auth/registrar", registrar);

router.get("/auth/acceder", renderAccederForm);

router.post("/auth/acceder", acceder);

router.get("/auth/salir", salir);

export default router;
