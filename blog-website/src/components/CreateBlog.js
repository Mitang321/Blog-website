import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateBlog.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newIssue = {
      title,
      body,
      labels: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await axios.post(
        "https://api.github.com/repos/Mitang321/Blog-Website/issues",
        newIssue,
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <div className="create-blog-container">
      <h1>Create a New Blog</h1>
      <form onSubmit={handleSubmit} className="create-blog-form">
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Blog Content</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="10"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., react, javascript, web development"
          />
        </div>
        <button type="submit" className="submit-button">
          Create Blog
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
