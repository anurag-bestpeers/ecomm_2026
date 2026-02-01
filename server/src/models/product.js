import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true })

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please provide product category"]
  },
  images: [
    {
      type: String
    }
  ],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [reviewSchema]
},
  { timestamps: true });

// Update ratings when reviews change
productSchema.methods.updateRatings = function () {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
};

export const Product = mongoose.model("Product", productSchema);