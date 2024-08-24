import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/Mitang321/Blog-website/issues"
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2>Blog List</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <a href={`/blog/${blog.number}`}>{blog.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
