import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./BlogDetail.css";

function BlogDetail() {
  const { number } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to fetch blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [number]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!blog) return <p>No blog found.</p>;

  return (
    <div className="blog-detail">
      <h1 className="blog-title">{blog.title}</h1>
      <p className="blog-date">
        {new Date(blog.created_at).toLocaleDateString()}
      </p>
      <div className="blog-body">
        <p>{blog.body}</p>
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
    </div>
  );
}

export default BlogDetail;
