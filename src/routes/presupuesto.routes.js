import { Router } from 'express';

import {
    renderPresupuestos,
    renderPrintPresupuesto,
    renderPresupuestoForm,
    createNewPresupuesto,
    renderEditForm,
    updatePresupuesto,
    deletePresupuesto,
    renderDashboard,
} from '../controllers/presupuesto.controllers.js';
import { isAuthenticated } from '../helpers/auth.js';

const router = Router();

//Default
router.get('/presupuesto', isAuthenticated, renderDashboard);

//Get All Presupuestos
router.get('/presupuesto/all-presupuesto', isAuthenticated, renderPresupuestos);

// New Presupuesto
router.get('/presupuesto/add', isAuthenticated, renderPresupuestoForm);

router.post('/presupuesto/new-presupuesto', isAuthenticated, createNewPresupuesto);

// Edit Presupuesto
router.get('/presupuesto/edit/:id', isAuthenticated, renderEditForm);

router.put('/presupuesto/edit-presupuesto/:id', isAuthenticated, updatePresupuesto);

// Delete Presupuesto
router.delete('/presupuesto/delete/:id', isAuthenticated, deletePresupuesto);

//Print Presupuesto
router.get('/presupuesto/print/:id', isAuthenticated, renderPrintPresupuesto);

export default router;
