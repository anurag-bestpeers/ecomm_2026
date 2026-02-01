import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../models/Category.js";
import { Product } from "../models/product.js";
import { DB } from "../config/db.js";

dotenv.config();

const categories = [
  {
    name: "Electronics",
    description: "Gadgets, devices, and accessories",
    image: "https://placehold.co/600x400/252f3f/ffffff?text=Electronics"
  },
  {
    name: "Clothing",
    description: "Men's and women's apparel",
    image: "https://placehold.co/600x400/252f3f/ffffff?text=Clothing"
  },
  {
    name: "Footwear",
    description: "Shoes, sneakers, and boots",
    image: "https://placehold.co/600x400/252f3f/ffffff?text=Footwear"
  },
  {
    name: "Home & Kitchen",
    description: "Furniture, decor, and appliances",
    image: "https://placehold.co/600x400/252f3f/ffffff?text=Home"
  },
  {
    name: "Books",
    description: "Fiction, non-fiction, and educational",
    image: "https://placehold.co/600x400/252f3f/ffffff?text=Books"
  }
];

const products = [
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Experience premium sound with our industry-leading noise canceling technology. Perfect for travel and work.",
    price: 299.99,
    categoryName: "Electronics",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"]
  },
  {
    name: "Smartphone Pro Max",
    description: "The ultimate smartphone with a stunning display, powerful processor, and professional-grade camera system.",
    price: 999.00,
    categoryName: "Electronics",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"]
  },
  {
    name: "Men's Cotton T-Shirt",
    description: "Soft, breathable cotton t-shirt available in multiple colors. Essential for your daily wardrobe.",
    price: 24.99,
    categoryName: "Clothing",
    stock: 100,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"]
  },
  {
    name: "Designer Denim Jacket",
    description: "Classic denim jacket with a modern twist. Durable, stylish, and perfect for layering.",
    price: 89.50,
    categoryName: "Clothing",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop"]
  },
  {
    name: "Running Sneakers",
    description: "Lightweight and comfortable running shoes designed for performance and endurance.",
    price: 120.00,
    categoryName: "Footwear",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"]
  },
  {
    name: "Leather Boots",
    description: "Premium leather boots that combine style and durability. Perfect for any occasion.",
    price: 150.00,
    categoryName: "Footwear",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop"]
  },
  {
    name: "Modern Sofa",
    description: "A sleek and comfortable sofa that fits perfectly in any modern living room.",
    price: 899.00,
    categoryName: "Home & Kitchen",
    stock: 10,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop"]
  },
  {
    name: "Coffee Maker",
    description: "Brew the perfect cup of coffee every morning with this programmable coffee maker.",
    price: 79.99,
    categoryName: "Home & Kitchen",
    stock: 45,
    images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&h=600&fit=crop"]
  },
  {
    name: "The Great Novel",
    description: "An award-winning novel that explores the complexities of human relationships.",
    price: 19.99,
    categoryName: "Books",
    stock: 200,
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop"]
  },
  {
    name: "Smart Watch Series 5",
    description: "Track your fitness, notifications, and health with the advanced new Smart Watch.",
    price: 399.00,
    categoryName: "Electronics",
    stock: 35,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"]
  }
];

const seedData = async () => {
  try {
    await DB();
    console.log("Connected to Database...");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing Categories and Products.");

    // Insert Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Inserted ${createdCategories.length} Categories.`);

    // Map Category Names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Prepare Products with Category IDs
    const productsWithIds = products.map(prod => {
      const { categoryName, ...productData } = prod;
      return {
        ...productData,
        category: categoryMap[categoryName]
      };
    });

    // Insert Products
    const createdProducts = await Product.insertMany(productsWithIds);
    console.log(`Inserted ${createdProducts.length} Products.`);

    console.log("Seeding Completed Successfully! 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Error Seeding Data:", error);
    process.exit(1);
  }
};

seedData();
