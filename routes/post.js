const express = require('express')
const {getPosts,
    createPost ,
    deletePost,
    likePost,
   addComment,
   deleteComment,
   getComments,
   editComment,
   likeComment,
} = require('../controllers/postController')
const uploadPost = require("../middleware/userMulter.js");



const router = express.Router();

router.get("/getPosts",getPosts);
router.post("/createPost",uploadPost,createPost);
router.delete("/deletePost",deletePost);
router.post("/likePost",likePost);
router.post("/addComment",addComment);
router.put("/deleteComment",deleteComment);
router.get("/getComments/:id",getComments);
router.patch("/editcomment/:id", editComment);
router.patch("/likeComment",likeComment);




module.exports = router