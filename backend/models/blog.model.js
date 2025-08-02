import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const blogSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [commentSchema],
    isPublished: {
        type: Boolean,
        default: false
    },
    readTime: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

blogSchema.index({ title: 'text', description: 'text', tags: 'text' });

blogSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

blogSchema.virtual('dislikeCount').get(function() {
    return this.dislikes.length;
});

blogSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog; 