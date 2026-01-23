import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt).toDateString();

  // Tambahkan axios
  const { axios } = useAppContext();

  // Membuat fungsionalitas delete
  const deleteBlog = async () => {
    const confirm = window.confirm("Are you sure want to delete this blog?");
    if (!confirm) return;
    try {
      const { data } = await axios.post("/api/blog/delete", { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Membuat fungsionalitas publish
  const togglePublish = async () => {
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,
      });

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${blog.isPublished ? "text-green-600" : "text-red-600"}`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        {/* Tambahkan onClick */}
        <button
          onClick={togglePublish}
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        {/* Tambahkan onClick */}
        <img
          onClick={deleteBlog}
          src={assets.cross_icon}
          className="w-8 hover:scale-110 transition-all cursor-pointer"
          alt=""
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
