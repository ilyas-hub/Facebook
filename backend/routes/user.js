const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth");

const { register, login } = require("../controllers/authController");

const {
  getUser,
  getAll,
  updateUser,
  deleteUser,
  getUserFriends,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

const {
  getCommentsFromPost,
  deleteComment,
  toggleLike,
  createComment,
} = require("../controllers/commentController");

const {
  getPost,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  getTimelinePosts,
  likePost,
  dislikePost,
} = require("../controllers/postController");

//-----------------------------Auth Router
router.post("/register", register);
router.post("/login", login);


//----------------------------User Router
router.get("/findAll", getAll);
router.get("/find/:id", getUser);
router.get("/find/userfriends/:id", getUserFriends);

router.put("/update/:id", verifyToken, updateUser);
router.put("/follow/:id", verifyToken, followUser);
router.put("/unfollow/:id", verifyToken, unfollowUser);

router.delete("/delete/:id", verifyToken, deleteUser);


//---------------------Post Router
router.get("/find/:id", getPost);
router.get("/find/userposts/:id", getUserPosts);
router.get("/timelinePosts", verifyToken, getTimelinePosts);

router.post("/", verifyToken, createPost);

router.put("/updatePost/:id", verifyToken, updatePost);
router.put("/likePost/:postId", verifyToken, likePost);
router.put("/dislikePost/:postId", verifyToken, dislikePost);

router.delete("/deletePost/:id", verifyToken, deletePost);

//----------------------------comment Routes
// get all comments from post
router.get("/:postId", getCommentsFromPost);

// create a comment
router.post("/", verifyToken, createComment);

// delete a comment
router.delete("/:commentId", verifyToken, deleteComment);

// like/unlike a comment
router.put("/toggleLike/:commentId", verifyToken, toggleLike);





module.exports = router;
