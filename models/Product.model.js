//schema
import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product Title is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product Price is required"],
    },
    stockQuanity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },

    brand: {
      type: String,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
    },

    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
  },
  { timestamps: true }
);

//model
const Product = mongoose.model("Product", productSchema);
//export
export default Product;
