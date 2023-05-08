const dotenv = require('dotenv')
const Post = require ("../models/postModel.js") ;
const jwt = require('jsonwebtoken')
const mongoose = require ("mongoose") ;
const Comment = require ("../models/commentModel.js") ;
const Investment = require ("../models/investment") ;
const User = require ("../models/userModel.js") ;
const  badWordsFilter = require ("bad-words");
dotenv.config()

let baadWordsFilter = new badWordsFilter();


const FindAllPostsByProj = async (req, res) => {
    try {

        const { LoggedInUser } = req.params;
        const {projectId } = req.body;
        // First, find all the investments made by the investor
        const investments = await Investment.find({ idUser: LoggedInUser ,isValid:"accepted" });

        // Create an array to store all the project IDs
        const projectIds = [];

        // Loop through each investment and push its project ID to the projectIds array
        investments.forEach(investment => {
            projectIds.push(investment.idProject);
        });

        // Use the projectIds array to find all the posts of the projects the investor has invested in
        const posts = await Post.find({ project: projectId }).populate({
            path: 'owner',
            select: 'userName avatar',
        }).sort({ createdAt: 1 });

// posts variable now contains all the posts created before the current date, for the projects the investor has invested in

        res.status(200).json(posts);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};




const FindAllPosts = async (req, res) => {
    try {

        const { LoggedInUser} = req.params;

        // First, find all the investments made by the investor
        const investments = await Investment.find({ idUser: LoggedInUser ,isValid:"accepted" });

        // Create an array to store all the project IDs
        const projectIds = [];

        // Loop through each investment and push its project ID to the projectIds array
        investments.forEach(investment => {
            projectIds.push(investment.idProject);
        });

        // Use the projectIds array to find all the posts of the projects the investor has invested in and the posts of the project that id is given in params


        const posts = await Post.find({
            $or: [
                { project: { $in: projectIds } }, // Find posts where the project ID is in projectIds

                { owner: LoggedInUser } // Find posts where the owner is the LoggedInUser
            ]
        }).populate({
            path: 'owner',
            select: 'userName avatar',
        }).populate({
            path: 'project',
            select: 'ProjectName Image',
        }).sort({ createdAt: 1 });

// posts variable now contains all the posts created before the current date, for the projects the investor has invested in

        res.status(200).json(posts);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// get user's post 
const getPosts = async (req, res) => {
    const { token } = req.params;
    const decodedToken = jwt.decode(token ,process.env.secret);
    const userId = decodedToken._id;
    try {
        Post.find({ owner: userId }).populate({
            path: 'owner',
            select: 'username avatar',
        }).sort({ createdAt: -1 }).exec((err, posts) => {
                if (err) {
                    res.status(404).json({ message: err.message });
                }
                else {
                    res.status(200).json(posts);
                }
            }
        );
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//create a post that contains the caption and the image
const createPost = async (req, res) => {
    const { caption,project } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    console.log(caption);
    const decodedToken = jwt.decode(token ,process.env.secret);
    const userId = decodedToken.userId;
    console.log(userId)

    const sanitizedBody = baadWordsFilter.clean(caption);
    // upload the image to the server
    const image = `${req.protocol}://localhost:4000/posts/${
        req.file.filename
    }`
    //
    const newPost = new Post({ caption: sanitizedBody, owner: userId , image,project:project });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    await Post.findByIdAndRemove(id);
    res.status(200).json({ message: "Post deleted successfully." });
}

const editPost = async (req, res) => {
    const { id } = req.params;
    const { caption} = req.body;
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.secret);
    const userId = decodedToken.id;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: `Post with id ${id} not found` });
        }

        // Check if the user is the owner of the post
        if (post.owner.toString() !== userId) {
            return res.status(401).json({ message: "You don't have permission to edit this post" });
        }

        post.caption = caption;
        post.category = category;

        await post.save();

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const likePost = async (req, res) => {
    try {
    const {token ,id } = req.body;
    const decodedToken = jwt.decode(token ,process.env.secret);
    const userId = decodedToken.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const post = await Post.findById(id);

    // Find the user id in the likes array
    const index = post.likes.findIndex((likeUserId) => likeUserId.equals(userId));

    if (index === -1) {
        // If the user has not liked the post, add their id to the likes array
        post.likes.push(userId);
        post.numberOfLikes += 1;
    } else {
        // If the user has already liked the post, remove their id from the likes array
        post.likes.splice(index, 1);
        post.numberOfLikes -= 1;
        post.$inc--;
    }

    // Save the updated post object to the database
    await post.save();

    res.status(200).json(post);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


// add a comment to a post
const addComment = async (req, res) => {
    const {postId, content } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = jwt.decode(token, process.env.secret);
    const userId = decodedToken.userId;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(404).send(`No post with id: ${postId}`);
    }
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).send(`No post with id: ${postId}`);
    }
    const sanitizedBody = baadWordsFilter.clean(content);
    const comment = new Comment({
        owner: userId,
        post: postId,
        content :sanitizedBody,
    });
    post.comments.push(comment);
    post.numberOfComments++;
    await comment.save();
    await post.save();

    // Populate the owner field in the comment
    const populatedComment = await Comment.findById(comment._id).populate({
        path: 'owner',
        select: 'username',
    });

    res.status(201).json(populatedComment);
};


// Delete a comment
const deleteComment = async (req, res) => {
    const { token,commentId } = req.body;
    const decodedToken = jwt.decode(token, process.env.secret);
    const userId = decodedToken.id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.owner.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await comment.remove();
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id },
            $inc: { numberOfComments: -1 },
        });
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get comments of a post
const getComments = async (req, res) => {
    const {postId} = req.params;

    try {
        await Comment.find({ post: postId })
            .populate({
                path: 'owner',
                select: 'userName avatar',
            }).sort({ createdAt: -1 }).exec((err, posts) => {
                    if (err) {
                        res.status(404).json({ message: err.message });
                    }
                    else {
                        res.status(200).json(posts);
                    }
                }
            )
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const editComment = async (req, res) => {
    const { commentId, content } = req.body;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.content = content;

        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const likeComment = async (req, res) => {
    const { token, commentId } = req.body;
    const decodedToken = jwt.decode(token, process.env.secret);
    const userId = decodedToken.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(404).send(`No comment with id: ${commentId}`);
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).send(`No comment with id: ${commentId}`);
    }

    const index = comment.likes.findIndex((id) => id.toString() === userId);
    if (index === -1) {
        comment.likes.push(userId);
        comment.numberOfLikes = comment.numberOfLikes + 1;
    } else {
        comment.likes.pull(userId);
        comment.numberOfLikes = comment.numberOfLikes - 1;
    }

    await comment.save();
    return res.status(200).json(comment);
};

module.exports = {FindAllPostsByProj, FindAllPosts,
    getPosts,
    createPost ,
    deletePost,
    editPost,
    likePost,
    addComment,
    deleteComment,
    getComments,
    editComment,
    likeComment,
};