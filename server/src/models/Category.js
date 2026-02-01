import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide category name"],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  }
},
  {
    timestamps: true
  });

export const Category = mongoose.model("Category", categorySchema);