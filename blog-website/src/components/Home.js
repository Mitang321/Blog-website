import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to the Blog Website</h1>
      <p>Here you can find various blogs fetched from our GitHub repository.</p>
      <Link to="/blogs">View Blogs</Link>
    </div>
  );
}

export default Home;
