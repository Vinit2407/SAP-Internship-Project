import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import validator from "validator"


// Create token function with consistent expiration
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await userModel.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      const token = createToken(user._id);
      res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
      });
      
      res.json({ 
        success: true, 
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Server error during login" 
      });
    }
}

// register user
const registeruser = async (req, res) => {
    const { name, password, email } = req.body;
    
    try {
      const exists = await userModel.findOne({ email });
      if (exists) {
        return res.json({ success: false, message: "User already exists" });
      }
  
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter valid email" });
      }
  
      if (password.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new userModel({
        name: name,
        email: email,
        password: hashedPassword
      });
  
      const user = await newUser.save();
      const token = createToken(user._id);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      
      res.json({ 
        success: true, 
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Error during registration" 
      });
    }
}


const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Initialize profile if it doesn't exist (without saving)
    const profile = user.profile || {
      firstName: "",
      lastName: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: ""
      }
    };

    res.json({
      success: true,
      profile: profile,
      email: user.email
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile"
    });
  }
};

// const updateProfile = async (req, res) => {
//   try {
//     const { firstName, lastName, phone, street, city, state, zipcode, country } = req.body;

//     const updatedUser = await userModel.findByIdAndUpdate(
//       req.user._id,
//       {
//         $set: {
//           "profile.firstName": firstName,
//           "profile.lastName": lastName,
//           "profile.phone": phone,
//           "profile.address": {
//             street,
//             city,
//             state,
//             zipcode,
//             country
//           }
//         }
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       profile: updatedUser.profile
//     });
//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating profile",
//       error: error.message // Include error message for debugging
//     });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, street, city, state, zipcode, country } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id, // Using the authenticated user's ID
      {
        $set: {
          "profile.firstName": firstName,
          "profile.lastName": lastName,
          "profile.phone": phone,
          "profile.address": {
            street,
            city,
            state,
            zipcode,
            country
          }
        }
      },
      { new: true, runValidators: true } // Ensure validations run and return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser.profile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
};

const getUser = async (req, res) => {
  try {
      // const user = await userModel.findById(req.body.userId);
      const user = req.user;

      if (!user) {
          return res.json({
              success: false,
              message: "User not found"
          });
      }

      res.json({
          success: true,
          user: {
              id: user._id,
              email: user.email,
              name: user.name,
              profile: user.profile || null
          }
      });
  } catch (error) {
      console.log('Error fetching user:', error);
      res.status(500).json({
          success: false,
          message: "Error fetching user data"
      });
  }
}

export {loginUser,registeruser, getProfile, updateProfile, getUser }