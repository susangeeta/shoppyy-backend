import { Router } from "express";
import {
  createProduct,
  getProducts,
  getproductbyid,
} from "../controllers/product.controller.js";

const router = Router();

// PRODUCT ROUTES
// Get all products from the database
router.get("/products", getProducts);

// Get a specific product using its ID
router.get("/product/:id", getproductbyid);

//post product
router.post("/products", createProduct);

// Export product routes
export default router;
