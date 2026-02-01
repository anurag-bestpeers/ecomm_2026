import { Category } from "../models/Category.js"

export const getCategory = async (req, res) => {
  try {
    const category = await Category.find().populate("parent", "name");
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    res.status(200).json({
      success: true,
      data: category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    })
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id).populate("parent", "name");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    res.status(200).json({
      success: true,
      data: category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, parent } = req.body;
    const categoryExists = await Category.findOne({name});
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      })
    }
    const category = await Category.create({
      name,
      description,
      image,
      parent: parent || null
    })

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }

    const { name, description, image, parent } = req.body;
    if (name) category.name = name;
    if (description) category.description = description;
    if (image) category.image = image;
    if (parent != null) category.parent = parent;

    await category.save();
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    })
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    })
  }
}