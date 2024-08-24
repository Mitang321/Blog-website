import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BlogDetail() {
  const { number } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/Mitang321/Blog-Website/issues/${number}`
        );
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
      }
    };

    fetchBlog();
  }, [number]);

  return (
    <div>
      {blog ? (
        <div>
          <h1>{blog.title}</h1>
          <p>{blog.body}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BlogDetail;
