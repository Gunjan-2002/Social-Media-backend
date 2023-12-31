import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    const picture = req.file;
    // console.log(picture);

    const pictureUri = getDataUri(picture);

    // console.log(pictureUri.fileName);

    const mycloud = await cloudinary.v2.uploader.upload(pictureUri.content);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
      dp: mycloud.secure_url,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    // res.status(201).json({
    //   status: "sucsess",
    //   message: "User Registered Succesfully",
    //   data: savedUser,
    // });
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/* LOGGING IN USER */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exists.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    // res.status(200).json({
    //   status: "success",
    //   message: "User Logged In Succesfully",
    //   data: {
    //     token : token,
    //     user: user,
    //   },
    // });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
