import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./BlogList.css";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedTag, setSelectedTag] = useState("");

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
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredByTag = selectedTag
    ? filteredBlogs.filter((blog) =>
        blog.labels.some((label) => label.name === selectedTag)
      )
    : filteredBlogs;

  const sortedBlogs = [...filteredByTag].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else {
      return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const tags = [
    ...new Set(blogs.flatMap((blog) => blog.labels.map((label) => label.name))),
  ];

  return (
    <div className="blog-list">
      <h1>Blog List</h1>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={handleSearchChange}
        />
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Sort by Date (Asc)</option>
          <option value="desc">Sort by Date (Desc)</option>
        </select>
        <select value={selectedTag} onChange={handleTagChange}>
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blog/${blog.number}`}>
              <h2>{blog.title}</h2>
              <p>{new Date(blog.created_at).toLocaleDateString()}</p>
              <div className="tags">
                {blog.labels.map((label) => (
                  <span key={label.id} className="tag">
                    {label.name}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
