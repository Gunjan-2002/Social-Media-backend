import express from "express";
import { getFeedPosts, getUserPosts, likePost, createPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

router.post("/posts", verifyToken,singleUpload , createPost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
