const express = require('express')
const {getPosts,
    createPost ,
    deletePost,
    editPost,
    likePost,
   addComment,
   deleteComment,
   getComments,
   editComment,
   likeComment,
} = require('../controllers/postController')
const uploadPost = require("../middleware/userMulter.js");



const router = express.Router();

router.get("/getPosts/:token",getPosts);
router.post("/createPost",uploadPost,createPost);
router.delete("/deletePost",deletePost);
router.put("/editPost/:id",editPost);
router.post("/likePost",likePost);
router.post("/addComment",addComment);
router.put("/deleteComment",deleteComment);
router.get("/getComments/:id",getComments);
router.patch("/editcomment/:id", editComment);
router.patch("/likeComment",likeComment);




module.exports = router