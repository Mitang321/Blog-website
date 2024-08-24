import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./BlogDetail.css";

function BlogDetail() {
  const { number } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.github.com/repos/Mitang321/Blog-Website/issues/${number}`,
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        setBlog(response.data);

        // Fetch comments
        const commentsResponse = await axios.get(
          `https://api.github.com/repos/Mitang321/Blog-Website/issues/${number}/comments`,
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        setComments(commentsResponse.data);

        setLikes(Math.floor(Math.random() * 100));

        const totalRating = commentsResponse.data.reduce(
          (acc, comment) => acc + (comment.rating || 0),
          0
        );
        setAverageRating(
          commentsResponse.data.length
            ? totalRating / commentsResponse.data.length
            : 0
        );
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to fetch blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [number]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Blog URL copied to clipboard!");
  };

  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await axios.post(
          `https://api.github.com/repos/Mitang321/Blog-Website/issues/${number}/comments`,
          {
            body: newComment,
          },
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        setComments([
          ...comments,
          { body: newComment, user: { login: "You" }, rating },
        ]);
        setNewComment("");
      } catch (error) {
        console.error("Error posting comment:", error);
        alert("Failed to post comment. Please try again later.");
      }
    }
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  useEffect(() => {
    if (comments.length > 0) {
      const totalRating = comments.reduce(
        (acc, comment) => acc + (comment.rating || 0),
        0
      );
      setAverageRating(totalRating / comments.length);
    }
  }, [comments]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!blog) return <p>No blog found.</p>;

  return (
    <div className="blog-detail">
      <Link to="/" className="back-link">
        &larr; Back to Blog List
      </Link>
      <h1 className="blog-title">{blog.title}</h1>
      <p className="blog-date">
        {new Date(blog.created_at).toLocaleDateString()}
      </p>
      <button className="like-button" onClick={handleLike}>
        Like ({likes})
      </button>
      <div className="rating-section">
        <h3>Rate this Blog:</h3>
        {[...Array(5)].map((star, index) => (
          <button
            key={index}
            className={index < rating ? "star selected" : "star"}
            onClick={() => handleRatingChange(index + 1)}
          >
            ★
          </button>
        ))}
        <p>Average Rating: {averageRating.toFixed(1)} / 5</p>
      </div>
      <div className="blog-body">
        <ReactMarkdown>{blog.body}</ReactMarkdown>
      </div>
      <div className="tags">
        <h3>Tags:</h3>
        {blog.labels.length > 0 ? (
          blog.labels.map((label) => (
            <span key={label.id} className="tag">
              {label.name}
            </span>
          ))
        ) : (
          <p>No tags available.</p>
        )}
      </div>
      <button className="share-button" onClick={handleShare}>
        Share
      </button>
      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
          />
          <button type="submit">Post Comment</button>
        </form>
        <ul className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <p className="comment-author">{comment.user.login}:</p>
                <p className="comment-body">{comment.body}</p>
                <p className="comment-rating">
                  Rating: {comment.rating || "Not rated"}
                </p>
              </li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default BlogDetail;
