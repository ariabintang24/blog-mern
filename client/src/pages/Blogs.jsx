import React from "react";
import Navbar from "../components/Navbar";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";

const Blogs = () => {
  return (
    <>
      <div className="pt-10">
        <BlogList />
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
