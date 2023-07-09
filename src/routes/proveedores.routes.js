import { Router } from "express";
import {
  renderProveedorForm,
  createNewProveedor,
  renderProveedores,
  renderEditForm,
  updateProveedor,
  deleteProveedor,
} from "../controllers/proveedores.controller.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

// New Proveedor
router.get("/Proveedores/add", isAuthenticated, renderProveedorForm);

router.post("/Proveedores/new-Proveedor", isAuthenticated, createNewProveedor);

// Get All Proveedores
router.get("/Proveedores", isAuthenticated, renderProveedores);

// Edit Proveedor
router.get("/Proveedores/edit/:id", isAuthenticated, renderEditForm);

router.put("/Proveedores/edit-Proveedor/:id", isAuthenticated, updateProveedor);

// Delete Proveedor
router.delete("/Proveedores/delete/:id", isAuthenticated, deleteProveedor);

export default router;
