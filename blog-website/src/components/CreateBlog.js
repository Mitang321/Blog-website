import React, { useState } from "react";
import axios from "axios";
import "./CreateBlog.css";
function CreateBlog() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);
  const handleTagsChange = (e) => setTags(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://api.github.com/repos/Mitang321/Blog-Website/issues",
        {
          title: title,
          body: body,
          labels: tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      alert("Blog created successfully!");
      setTitle("");
      setBody("");
      setTags("");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Error creating blog. Please try again.");
    }
  };

  return (
    <div className="create-blog">
      <h1>Create a New Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={handleBodyChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={handleTagsChange}
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
}

export default CreateBlog;
