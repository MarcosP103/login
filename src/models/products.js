import mongoose from "mongoose";

const productsCollection = "Products";

const productsSchema = new mongoose.Schema({
    title: String,
    price: Number
});

const productCollection = mongoose.model(productsCollection, productsSchema);

export default productCollection