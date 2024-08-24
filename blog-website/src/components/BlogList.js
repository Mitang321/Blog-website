import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./BlogList.css";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/Mitang321/Blog-Website/issues",
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        setBlogs(response.data);
        const fetchedTags = Array.from(
          new Set(
            response.data.flatMap((blog) =>
              blog.labels.map((label) => label.name)
            )
          )
        );
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);
  const handleTagChange = (e) => setSelectedTag(e.target.value);

  const filteredBlogs = blogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((blog) =>
      selectedTag === "all"
        ? true
        : blog.labels.some((label) => label.name === selectedTag)
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  return (
    <div className="blog-list">
      <h1>Blog List</h1>
      <Link to="/create" className="create-blog-link">
        Create New Blog
      </Link>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="desc">Sort by Title (Descending)</option>
          <option value="asc">Sort by Title (Ascending)</option>
        </select>
        <select value={selectedTag} onChange={handleTagChange}>
          <option value="all">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <li key={blog.number}>
              <Link to={`/blog/${blog.number}`} className="blog-link">
                <h2>{blog.title}</h2>
                <p>{blog.body.slice(0, 100)}...</p>
              </Link>
            </li>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </ul>
    </div>
  );
}

export default BlogList;
