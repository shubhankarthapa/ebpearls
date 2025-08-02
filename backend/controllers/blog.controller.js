import Blog from "../models/blog.model.js";

export const createBlog = async (req, res) => {
    try {
        const { title, description, content, tags, isPublished } = req.body;
        const author = req.user._id;

        const blog = new Blog({
            author,
            title,
            description,
            content,
            tags: tags || [],
            isPublished: isPublished || false
        });

        const savedBlog = await blog.save();
        
        await savedBlog.populate('author', 'name username profile_url');

        res.status(201).json({
            status: true,
            message: "Blog created successfully!",
            data: savedBlog
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error creating blog",
            error: error.message
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tag, author, published } = req.query;
        
        const query = {};
        
        if (published !== undefined) {
            query.isPublished = published === 'true';
        }
        
        if (author) {
            query.author = author;
        }
        
        if (tag) {
            query.tags = { $in: [tag] };
        }
        
        if (search) {
            query.$text = { $search: search };
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name username profile_url')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Blog.countDocuments(query);

        res.status(200).json({
            status: true,
            message: "Blogs fetched successfully!",
            data: {
                blogs,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching blogs",
            error: error.message
        });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findById(id)
            .populate('author', 'name username profile_url')
            .populate('comments.author', 'name username profile_url')
            .populate('likes', 'name username')
            .populate('dislikes', 'name username');

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Blog fetched successfully!",
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching blog",
            error: error.message
        });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, tags, isPublished } = req.body;
        const userId = req.user._id;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        if (blog.author.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: "You can only update your own blogs"
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                title,
                description,
                content,
                tags,
                isPublished
            },
            { new: true }
        ).populate('author', 'name username profile_url');

        res.status(200).json({
            status: true,
            message: "Blog updated successfully!",
            data: updatedBlog
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error updating blog",
            error: error.message
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        if (blog.author.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: "You can only delete your own blogs"
            });
        }

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            status: true,
            message: "Blog deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error deleting blog",
            error: error.message
        });
    }
};


export const likeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        
        const alreadyLiked = blog.likes.includes(userId);
        
        if (alreadyLiked) {
            
            blog.likes = blog.likes.filter(likeId => likeId.toString() !== userId.toString());
        } else {
            
            blog.likes.push(userId);
            
            blog.dislikes = blog.dislikes.filter(dislikeId => dislikeId.toString() !== userId.toString());
        }

        await blog.save();

        res.status(200).json({
            status: true,
            message: alreadyLiked ? "Blog unliked successfully!" : "Blog liked successfully!",
            data: {
                likes: blog.likes.length,
                dislikes: blog.dislikes.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error liking blog",
            error: error.message
        });
    }
};


export const dislikeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        
        const alreadyDisliked = blog.dislikes.includes(userId);
        
        if (alreadyDisliked) {
            
            blog.dislikes = blog.dislikes.filter(dislikeId => dislikeId.toString() !== userId.toString());
        } else {
            
            blog.dislikes.push(userId);
            
            blog.likes = blog.likes.filter(likeId => likeId.toString() !== userId.toString());
        }

        await blog.save();

        res.status(200).json({
            status: true,
            message: alreadyDisliked ? "Blog undisliked successfully!" : "Blog disliked successfully!",
            data: {
                likes: blog.likes.length,
                dislikes: blog.dislikes.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error disliking blog",
            error: error.message
        });
    }
};


export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        const comment = {
            author: userId,
            content
        };

        blog.comments.push(comment);
        await blog.save();

        
        const populatedBlog = await Blog.findById(id)
            .populate('comments.author', 'name username profile_url');

        const newComment = populatedBlog.comments[populatedBlog.comments.length - 1];

        res.status(201).json({
            status: true,
            message: "Comment added successfully!",
            data: newComment
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error adding comment",
            error: error.message
        });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        const comment = blog.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                status: false,
                message: "Comment not found"
            });
        }

        
        if (comment.author.toString() !== userId.toString() && blog.author.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: "You can only delete your own comments or comments on your blogs"
            });
        }

        comment.remove();
        await blog.save();

        res.status(200).json({
            status: true,
            message: "Comment deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error deleting comment",
            error: error.message
        });
    }
};


export const getUserBlogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const blogs = await Blog.find({ author: userId, isPublished: true })
            .populate('author', 'name username profile_url')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Blog.countDocuments({ author: userId, isPublished: true });

        res.status(200).json({
            status: true,
            message: "User blogs fetched successfully!",
            data: {
                blogs,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching user blogs",
            error: error.message
        });
    }
}; 