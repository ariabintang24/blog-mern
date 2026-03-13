import React, { useState } from "react";
import { blog_data, blogCategories } from "../assets/assets";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input, setInput, searched, setSearched } = useAppContext();

  const filteredBlogs = blogs.filter((blog) => {
    const matchCategory = menu === "All" || blog.category === menu;

    const matchSearch =
      input === "" ||
      blog.title.toLowerCase().includes(input.toLowerCase()) ||
      blog.category.toLowerCase().includes(input.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredBlogs.length === 0 ? (
          searched ? (
            /* Empty state untuk search */
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
            /* Empty state untuk kategori */
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
          filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>
    </div>
  );
};

export default BlogList;
