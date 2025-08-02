# Blog API Documentation

This API provides comprehensive blog management functionality with authentication, CRUD operations, likes/dislikes, and comments.

## Base URL
```
http://localhost:3000/api
```

## Features

- **Authentication**: JWT-based authentication with protected routes
- **CRUD Operations**: Create, Read, Update, Delete blog posts
- **Like/Dislike System**: Users can like or dislike blog posts
- **Comments**: Users can add and delete comments on blog posts
- **Search & Filtering**: Search blogs by title, description, tags, and filter by various criteria
- **Pagination**: Built-in pagination for listing blogs
- **Author Management**: Users can only edit/delete their own blogs

## API Endpoints

### Authentication Routes

#### Signup
```
POST /api/users/signup
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profile_url": "https://example.com/profile.jpg",
  "gender": "male",
  "address": "123 Main St, City, Country",
  "username": "johndoe"
}
```
**Response:**
```json
{
  "status": true,
  "message": "User registered successfully!",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profile_url": "https://example.com/profile.jpg",
    "gender": "male",
    "address": "123 Main St, City, Country",
    "username": "johndoe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### Login
```
POST /api/users/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "status": true,
  "message": "Login successful!",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profile_url": "https://example.com/profile.jpg",
    "gender": "male",
    "address": "123 Main St, City, Country",
    "username": "johndoe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### Logout
```
POST /api/users/logout
```
**Headers:**
```
Authorization: Bearer <token>
```

#### Get Profile
```
GET /api/users/profile
```
**Headers:**
```
Authorization: Bearer <token>
```

### Public Routes (No Authentication Required)

#### Get All Blogs
```
GET /api/blogs
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of blogs per page (default: 10)
- `search` (optional): Search term for title, description, or tags
- `tag` (optional): Filter by specific tag
- `author` (optional): Filter by author ID
- `published` (optional): Filter by published status (true/false)

**Example:**
```
GET /blogs?page=1&limit=5&search=javascript&tag=programming&published=true
```

#### Get Blog by ID
```
GET /api/blogs/:id
```
Returns a single blog with populated author, comments, likes, and dislikes.

#### Get User's Blogs
```
GET /api/blogs/user/:userId
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of blogs per page (default: 10)

### Protected Routes (Authentication Required)

#### Create Blog
```
POST /api/blogs
```
**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "My Blog Title",
  "description": "A brief description of the blog",
  "content": "The full content of the blog post...",
  "tags": ["javascript", "programming", "web"],
  "isPublished": true
}
```

#### Update Blog
```
PUT /api/blogs/:id
```
**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (same as create blog)
```json
{
  "title": "Updated Blog Title",
  "description": "Updated description",
  "content": "Updated content...",
  "tags": ["javascript", "react"],
  "isPublished": false
}
```

#### Delete Blog
```
DELETE /api/blogs/:id
```
**Headers:**
```
Authorization: Bearer <token>
```

### Like/Dislike Routes

#### Like/Unlike Blog
```
POST /api/blogs/:id/like
```
**Headers:**
```
Authorization: Bearer <token>
```

#### Dislike/Undislike Blog
```
POST /api/blogs/:id/dislike
```
**Headers:**
```
Authorization: Bearer <token>
```

### Comment Routes

#### Add Comment
```
POST /api/blogs/:id/comments
```
**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "content": "This is a great blog post!"
}
```

#### Delete Comment
```
DELETE /api/blogs/:blogId/comments/:commentId
```
**Headers:**
```
Authorization: Bearer <token>
```

## Blog Model Schema

```javascript
{
  author: ObjectId (ref: User),
  title: String (required),
  description: String (required),
  content: String (required),
  tags: [String],
  likes: [ObjectId (ref: User)],
  dislikes: [ObjectId (ref: User)],
  comments: [{
    author: ObjectId (ref: User),
    content: String,
    createdAt: Date
  }],
  isPublished: Boolean (default: false),
  readTime: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Response Format

All API responses follow this format:

```json
{
  "status": true/false,
  "message": "Success/Error message",
  "data": {
    // Response data
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication. Protected routes require a valid session cookie.

### Authentication Flow

1. **Signup**: User registers with email, password, and other details
   - Password is hashed using bcrypt
   - JWT token is generated and stored in HTTP-only cookie
   - User data and token are returned in response

2. **Login**: User logs in with email and password
   - Password is verified against hashed password
   - JWT token is generated and stored in HTTP-only cookie
   - User data and token are returned in response

3. **Protected Routes**: All protected routes check for valid JWT token
   - Token is verified and decoded
   - User data is attached to request object
   - If token is invalid/expired, 401 error is returned

4. **Logout**: User logs out
   - Session cookie is cleared
   - User is logged out successfully

### Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt
- **HTTP-only Cookies**: JWT tokens are stored in secure, HTTP-only cookies
- **Token Expiration**: Tokens expire after 5 days
- **Secure Headers**: Cookies use secure and sameSite flags
- **Input Validation**: All user inputs are validated
- **Duplicate Prevention**: Email and username must be unique

## Features

### Search and Filtering
- Text search across title, description, and tags
- Filter by tags, author, and published status
- Pagination support

### Like/Dislike System
- Users can like or dislike blog posts
- A user can only like OR dislike a post (not both)
- Like/dislike counts are included in responses

### Comments
- Users can add comments to any blog post
- Users can delete their own comments
- Blog authors can delete any comment on their posts
- Comments include author information

### Authorization
- Users can only edit/delete their own blogs
- Users can only delete their own comments (or comments on their blogs)
- All users can like/dislike and comment on any published blog

## Example Usage

### User Registration
```javascript
const response = await fetch('/api/users/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    profile_url: 'https://example.com/profile.jpg',
    gender: 'male',
    address: '123 Main St, City, Country',
    username: 'johndoe'
  })
});
```

### User Login
```javascript
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const result = await response.json();
const token = result.token; // Store this token for authenticated requests
```

### Creating a Blog
```javascript
const response = await fetch('/api/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    title: 'Getting Started with Node.js',
    description: 'Learn the basics of Node.js development',
    content: 'Node.js is a powerful JavaScript runtime...',
    tags: ['nodejs', 'javascript', 'backend'],
    isPublished: true
  })
});
```

### Getting Blogs with Filters
```javascript
const response = await fetch('/api/blogs?search=javascript&tag=programming&published=true&page=1&limit=5');
```

### Liking a Blog
```javascript
const response = await fetch('/api/blogs/123/like', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>'
  }
});
```

### Adding a Comment
```javascript
const response = await fetch('/api/blogs/123/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    content: 'Great article! Very helpful.'
  })
});
``` 