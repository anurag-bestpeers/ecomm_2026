import cloudinary from "../config/cloudinary.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/product.js";

export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, pageLimit = 12 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};

    if (sort == "price-asc") sortOption.price = 1
    else if (sort == "price-desc") sortOption.price = -1
    else if (sort == "rating") sortOption["rating.average"] = -1
    else if (sort == "newest") sortOption.createdAt = -1
    else sortOption.createdAt = -1

    const skip = (page - 1) * pageLimit;


    const products = await Product.find(query).populate("category", "name").sort(sortOption).skip(skip).limit(Number(pageLimit))

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageLimit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(pageLimit),
        total: totalProducts,
        pages: totalPages,
      },
    });

  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category", "name").populate("reviews.user", "name");

    if (!product) {
     return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: images || []
    })
    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }
    const { name, description, price, category, stock, images } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        })
      }
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (images) product.images = images;

    await product.save();
    res.status(200).json({
      success: true,
      updatedData: product,
      message: "Product updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    // Delete images from Cloudinary
    for (const imageUrl of product.images) {
      // Extract public_id from URL and delete
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`ecommerce/${publicId}`);
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }
    const file = req.files.image;
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "ecommerce/products",
      use_filename: true,
    });
    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};