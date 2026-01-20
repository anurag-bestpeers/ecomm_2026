import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already exist", success: false });
    }

    const count = await User.countDocuments();
    const role = count === 0 ? "admin" : "customer";

    const newUser = await User.create({
      name,
      email,
      password,
      role
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: token,
        role:newUser.role
      },
      success: true
    })
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const userExist = await User.findOne({ email }).select('+password');;

    if (!userExist) {
      return res.status(400).json({ message: "User does not exist", success: false })
    }

    const isPasswordMatched = await userExist.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false
      })
    }
    const token = generateToken(userExist._id);

    return res.status(200).json({
      message: "User Login successfully",
      data: {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        token: token,
        role: userExist.role
      },
      success: true
    })
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};