import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditBlog.css";

function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/Mitang321/Blog-website/issues/${id}`,
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        setTitle(response.data.title);
        setBody(response.data.body);
        setTags(response.data.labels.join(", "));
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedIssue = {
      title,
      body,
      labels: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await axios.patch(
        `https://api.github.com/repos/Mitang321/Blog-Website/issues/${id}`,
        updatedIssue,
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  return (
    <div className="edit-blog-container">
      <h1>Edit Blog</h1>
      <form onSubmit={handleSubmit} className="edit-blog-form">
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
          <ReactQuill
            id="body"
            value={body}
            onChange={(value) => setBody(value)}
            theme="snow"
          />
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
          Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
