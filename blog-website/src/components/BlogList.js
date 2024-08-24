import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import "./BlogList.css";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editTags, setEditTags] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://api.github.com/repos/Mitang321/Blog-Website/issues",
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      const fetchedBlogs = response.data;

      const blogsWithCommentsAndRatings = await Promise.all(
        fetchedBlogs.map(async (blog) => {
          const commentsResponse = await axios.get(
            `https://api.github.com/repos/Mitang321/Blog-Website/issues/${blog.number}/comments`,
            {
              headers: {
                Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
              },
            }
          );
          const comments = commentsResponse.data;
          const totalRating = comments.reduce(
            (acc, comment) => acc + (comment.rating || 0),
            0
          );
          const averageRating =
            comments.length > 0 ? totalRating / comments.length : 0;
          return {
            ...blog,
            commentsCount: comments.length,
            averageRating: isNaN(averageRating) ? 0 : averageRating,
          };
        })
      );

      setBlogs(blogsWithCommentsAndRatings);

      const fetchedTags = Array.from(
        new Set(
          blogsWithCommentsAndRatings.flatMap((blog) =>
            blog.labels.map((label) => label.name)
          )
        )
      );
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);
  const handleTagChange = (e) => setSelectedTag(e.target.value);

  const handleEditClick = (blog) => {
    setEditMode(blog.number);
    setEditTitle(blog.title);
    setEditBody(blog.body);
    setEditTags(blog.labels.map((label) => label.name).join(", "));
  };

  const handleSaveClick = async (number) => {
    try {
      const updatedBlog = {
        title: editTitle,
        body: editBody,
        labels: editTags.split(",").map((tag) => tag.trim()),
      };
      await axios.patch(
        `https://api.github.com/repos/Mitang321/Blog-Website/issues/${number}`,
        updatedBlog,
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      setEditMode(null);
      setEditTitle("");
      setEditBody("");
      setEditTags("");
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
      setError("Failed to update blog. Please try again later.");
    }
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setEditTitle("");
    setEditBody("");
    setEditTags("");
  };

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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredBlogs.length / blogsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <ul>
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <li key={blog.number} className="blog-item">
                  {editMode === blog.number ? (
                    <div className="edit-blog-form">
                      <h2>Edit Blog</h2>
                      <div className="form-group">
                        <label htmlFor="editTitle">Blog Title</label>
                        <input
                          type="text"
                          id="editTitle"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="editBody">Blog Content</label>
                        <textarea
                          id="editBody"
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          rows="10"
                          required
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="editTags">Tags (comma separated)</label>
                        <input
                          type="text"
                          id="editTags"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="e.g., react, javascript, web development"
                        />
                      </div>
                      <button
                        type="button"
                        className="submit-button"
                        onClick={() => handleSaveClick(blog.number)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Link to={`/blog/${blog.number}`} className="blog-link">
                      <h2>{blog.title}</h2>
                      <p className="blog-date">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </p>
                      <p>{blog.body.slice(0, 100)}...</p>
                      <p className="blog-comments">
                        Comments: {blog.commentsCount}
                      </p>
                      <p className="blog-rating">
                        Rating: {blog.averageRating.toFixed(1)} / 5
                      </p>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEditClick(blog)}
                      >
                        Edit
                      </button>
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <p>No blogs found.</p>
            )}
          </ul>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={number === currentPage ? "active" : ""}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BlogList;
