import React from "react";
import { useNavigate } from "react-router-dom";

const PostBlog = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-8 sm:mx-16 xl:mx-40 mb-24">
      <div className="bg-gradient-to-r from-primary/90 to-primary rounded-2xl text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
            Share your story with the world
          </h2>

          <p className="text-sm opacity-90 max-w-md">
            Have ideas, experiences, or knowledge to share? Start writing and
            publish your own blog today.
          </p>
        </div>

        <button
          onClick={() => navigate("/create-blog")}
          className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:scale-105 transition"
        >
          Post Your Blog
        </button>
      </div>
    </section>
  );
};

export default PostBlog;
