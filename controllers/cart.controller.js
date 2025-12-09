import mongoose from "mongoose";
import CartModel from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

async function getCartForUser(userid) {
  let cart = await CartModel.findOne({ user: userid });
  if (!cart) {
    cart = await CartModel.create({ user: userid, items: [] });
  }
  return cart;
}

//ADD PRODUCT TO CART
export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate productId & quantity
    if (!productId)
      return res.status(400).json({ message: "productId required" });
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: "Invalid productId" });
    if (quantity < 1)
      return res.status(400).json({ message: "Quantity must be at least 1" });

    // Check product availability
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ message: "insufficient stock" });

    // Fetch or create user cart
    const cart = await getCartForUser(req.user._id);

    // Check if product already exists in cart
    const idx = cart.items.findIndex((i) => i.product.toString() === productId);

    if (idx > -1) {
      // If exists → update quantity
      const newQty = cart.items[idx].quantity + quantity;
      if (newQty > product.stock)
        return res.status(400).json({ message: "insufficient stock" });

      cart.items[idx].quantity = newQty;
    } else {
      // If not exists → add as new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save(); // Save cart changes
    return res.status(200).json(cart);
  } catch (err) {
    return res
      .status(500)
      .json({ "error occurred during adding product to cart": err.message });
  }
}

//UPDATE CART ITEM QUANTITY
export async function updateCart(req, res) {
  try {
    const { productId } = req.params; // Extract productId from URL params
    const { quantity } = req.body; // Get new quantity

    // Validate inputs
    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "invalid quantity" });
    if (!productId)
      return res.status(400).json({ message: "productId required" });
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: "Invalid productId" });

    // Get user's cart
    const cart = await getCartForUser(req.user._id);

    // Check if product exists in cart
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    // Validate product stock
    const product = await Product.findById(productId);
    if (product && product.stock < quantity)
      return res.status(400).json({ message: "insufficient stock" });

    // Update quantity
    item.quantity = quantity;
    await cart.save(); // Save changes
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({
      "error occurred while updating product quantity to cart": err.message,
    });
  }
}

// REMOVE PRODUCT FROM CART
export async function removeProduct(req, res) {
  try {
    const { productId } = req.params; // Extract productId from URL params

    // Validate productId
    if (!productId)
      return res.status(400).json({ message: "productId required" });
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: "Invalid productId" });

    // Fetch user's cart
    const cart = await getCartForUser(req.user._id);

    // Check if item exists in cart
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    // Remove item
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    await cart.save(); // Save change
    return res.json(cart);
  } catch (err) {
    return res
      .status(500)
      .json({ "error occurred while removing product from cart": err.message });
  }
}

//GET USER CART
export async function getCart(req, res) {
  try {
    const cart = await getCartForUser(req.user._id); // Fetch cart
    await cart.populate("items.product"); // Populate product details
    return res.json(cart);
  } catch (err) {
    return res
      .status(500)
      .json({ "error occurred while fetching cart": err.message });
  }
}
