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

// Get All Proveedores
router.get("/proveedores", isAuthenticated, renderProveedores);

// New Proveedor
router.get("/proveedores/add", isAuthenticated, renderProveedorForm);

router.post("/proveedores/new-Proveedor", isAuthenticated, createNewProveedor);

// Edit Proveedor
router.get("/proveedores/edit/:id", isAuthenticated, renderEditForm);

router.put("/proveedores/edit-Proveedor/:id", isAuthenticated, updateProveedor);

// Delete Proveedor
router.delete("/proveedores/delete/:id", isAuthenticated, deleteProveedor);

export default router;
