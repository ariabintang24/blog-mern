import React, { useState } from "react";
import { blogCategories } from "../assets/assets";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const BlogList = ({ limit }) => {
  const [menu, setMenu] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { blogs, input, setInput, searched, setSearched } = useAppContext();

  const blogsPerPage = 8;

  const filteredBlogs = blogs.filter((blog) => {
    const matchCategory = menu === "All" || blog.category === menu;

    const matchSearch =
      input === "" ||
      blog.title.toLowerCase().includes(input.toLowerCase()) ||
      blog.category.toLowerCase().includes(input.toLowerCase());

    return matchCategory && matchSearch;
  });

  // ✦ LOGIC UTAMA (limit vs pagination)
  let displayedBlogs = filteredBlogs;

  if (limit) {
    displayedBlogs = filteredBlogs.slice(0, limit);
  } else {
    const indexOfLast = currentPage * blogsPerPage;
    const indexOfFirst = indexOfLast - blogsPerPage;
    displayedBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);
  }

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <div>
      {/* CATEGORY */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => {
                setMenu(item);
                setCurrentPage(1); // reset page saat filter
              }}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredBlogs.length === 0 ? (
          searched ? (
            <div className="col-span-full text-center py-16">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No posts found for "{input}"
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                Try searching with a different keyword.
              </p>

              <button
                onClick={() => {
                  setInput("");
                  setSearched(false);
                }}
                className="bg-primary text-white px-5 py-2 rounded-md shadow transition cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="col-span-full text-center py-16">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No articles in "{menu}"
              </h2>

              <p className="text-gray-500 text-sm">
                There are no blog posts in this category yet.
              </p>
            </div>
          )
        ) : (
          displayedBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>

      {/* ✦ VIEW ALL (HANYA DI HOME) */}
      {limit && (
        <div className="text-center mt-12 mb-24">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-2 border rounded bg-primary text-white transition"
          >
            View All Blogs
            <FiArrowRight className="text-lg" />
          </Link>
        </div>
      )}

      {/* ✦ PAGINATION (HANYA DI BLOGS PAGE) */}
      {!limit && totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-20 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
