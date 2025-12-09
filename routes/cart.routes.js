import { Router } from "express";
import {
  addToCart,
  getCart,
  removeProduct,
  updateCart,
} from "../controllers/cart.controller.js";
import verifyToken from "../middleware/verify.js";

const router = Router();

// ---------------------------------------------
// CART ROUTES (Protected with JWT Authentication)
// ---------------------------------------------

// Add product to cart (only if user is authenticated)
router.post("/cart", verifyToken, addToCart);

// Update quantity of a specific product in cart (requires valid token)
router.put("/cart/:productId", verifyToken, updateCart);

// Remove a specific product from cart (requires valid token)
router.delete("/cart/:productId", verifyToken, removeProduct);

// Get all products in the user's cart (requires valid token)
router.get("/cart", verifyToken, getCart);

// Export cart routes
export default router;
