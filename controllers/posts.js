import Post from "../models/Post.js";
import User from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const user = await User.findById(req.userAuth._id);

    const picture = req.file;
    // console.log(picture);

    const pictureUri = getDataUri(picture);
    // console.log(pictureUri.fileName);

    const mycloud = await cloudinary.v2.uploader.upload(pictureUri.content);

    const newPost = new Post({
      userId: req.userAuth._id,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
      userPicturePath: user.picturePath,
      userDp: user.dp,
      postDp: mycloud.secure_url,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
