import express from 'express';
import { auth } from '../middleware/auth.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

const router = express.Router();

// Add comment
router.post('/', auth, async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = new Comment({
      author: req.user._id,
      post: postId,
      content: content.trim(),
      parentComment: parentCommentId || null
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    // Add comment to post
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    // If it's a reply, add to parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: comment._id } });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null
    })
    .populate('author', 'username avatar')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'username avatar'
      }
    })
    .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: req.params.id } });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;