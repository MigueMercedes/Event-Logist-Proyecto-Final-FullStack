import { Router } from "express";

import {
    renderPresupuestos,
    renderPresupuestoForm,
    createNewPresupuesto,
    renderEditForm,
    updatePresupuesto,
    deletePresupuesto,
} from "../controllers/presupuesto.controllers.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

//Get All Presupuestos
router.get('/presupuesto', isAuthenticated, renderPresupuestos);

// New Presupuesto
router.get("/presupuesto/add", isAuthenticated, renderPresupuestoForm);

router.post("/presupuesto/new-presupuesto", isAuthenticated, createNewPresupuesto);

// Edit Presupuesto
router.get("/presupuesto/edit/:id", isAuthenticated, renderEditForm);

router.put("/presupuesto/edit-presupuesto/:id", isAuthenticated, updatePresupuesto);

// Delete Presupuesto
router.delete("/presupuesto/delete/:id", isAuthenticated, deletePresupuesto);

export default router;
