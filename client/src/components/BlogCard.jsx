import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="inline-block mb-3 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
          {category}
        </span>

        {/* TITLE CLICKABLE */}
        <h3
          onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
          className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1 cursor-pointer hover:text-primary transition"
        >
          {title}
        </h3>

        <p
          className="text-sm text-gray-600 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};

export default BlogCard;
