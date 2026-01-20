import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide username"],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  },
  avatar: {
    type: String,
    default: ""
  },
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: {
        type: Boolean,
        default: false,
      },
    },
  ],
},
  { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

export const User = mongoose.model("User", userSchema);