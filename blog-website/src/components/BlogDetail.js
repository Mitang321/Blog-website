import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./BlogDetail.css";

function BlogDetail() {
  const { number } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
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
      }
    };

    fetchBlog();
  }, [number]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="blog-detail">
      <h1>{blog.title}</h1>
      <p>{blog.body}</p>
      <div className="tags">
        <h3>Tags:</h3>
        {blog.labels.map((label) => (
          <span key={label.id} className="tag">
            {label.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default BlogDetail;
