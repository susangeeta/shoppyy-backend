import mongoose from "mongoose";
import Product from "../models/Product.model.js";

//get all products
export async function getProducts(req, res) {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // If no products found
    if (!products) {
      return res.status(404).json({ message: "products are not Found" });
    }

    // Send products list as response
    return res.status(200).json({ products });
  } catch (err) {
    return res
      .status(500)
      .json({ "Error while fetching products": err.message });
  }
}

//get specic product by id
export async function getproductbyid(req, res) {
  try {
    const id = req.params.id; // Extract product ID from URL

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    // Find product by ID
    const product = await Product.findById(id);

    // If product with given ID doesn't exist
    if (!product) {
      return res
        .status(404)
        .json({ message: "Currently product with Id not Exists" });
    }

    // Send product as response
    return res.status(200).json({ product });
  } catch (err) {
    return res
      .status(500)
      .json({ "Error while fetching product": err.message });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      price,
      stockQuanity,
      rating,
      brand,
      category,
      thumbnail,
    } = req.body;

    // Check required fields (title, description, price, thumbnail)
    if (!title || !description || !price || !thumbnail) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check duplicate title
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product title must be unique. This title already exists.",
      });
    }

    // Create new product
    const newProduct = new Product({
      title,
      description,
      price,
      stockQuanity: stockQuanity || 0,
      rating: rating || 0,
      brand,
      category,
      thumbnail,
    });

    // Save product
    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while creating product",
      error: err.message,
    });
  }
}
