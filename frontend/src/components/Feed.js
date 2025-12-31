import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    try {
      await api.post('/posts', { content: newPost });
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.put(`/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      await api.post(`/posts/${postId}/comment`, { text });
      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        fetchPosts();
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  return (
    <div className="feed-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="nav-logo">MYSOCIAL</h1>
          <div className="nav-user">
            <span>Welcome, {user?.username}!</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </nav>

      <div className="feed-content">
        <div className="create-post-box">
          <h2>What's on your mind?</h2>
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="Share something..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength="500"
              rows="4"
            />
            <div className="post-actions">
              <span className="char-count">{newPost.length}/500</span>
              <button type="submit" disabled={loading || !newPost.trim()}>
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="no-posts">No posts yet. Be the first to post!</div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-user">
                    <div className="user-avatar">{post.username[0].toUpperCase()}</div>
                    <div>
                      <div className="post-username">{post.username}</div>
                      <div className="post-time">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {post.user === user?.id && (
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="post-content">{post.content}</div>

                <div className="post-actions-bar">
                  <button 
                    className={`btn-like ${post.likes.includes(user?.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    ❤️ {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                  </button>
                  <span className="comment-count">
                    💬 {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                  </span>
                </div>

                {post.comments.length > 0 && (
                  <div className="comments-section">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="comment">
                        <div className="comment-avatar">{comment.username[0].toUpperCase()}</div>
                        <div className="comment-content">
                          <div className="comment-username">{comment.username}</div>
                          <div className="comment-text">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(post._id);
                      }
                    }}
                  />
                  <button onClick={() => handleComment(post._id)}>Send</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;


