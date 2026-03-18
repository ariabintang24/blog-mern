import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  

  const { title, createdAt } = blog;
  const [deleteId, setDeleteId] = useState(null);
  const BlogDate = new Date(createdAt).toDateString();

  // Tambahkan axios
  const { axios } = useAppContext();

  // Membuat fungsionalitas delete
  const handleDeleteClick = () => {
    setDeleteId(blog._id);
  };

  // Membuat fungsionalitas delete
  const deleteBlog = async () => {
    try {
      const { data } = await axios.post("/api/blog/delete", {
        id: deleteId,
      });

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteId(null);
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
    <>
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
            onClick={handleDeleteClick}
            src={assets.cross_icon}
            className="w-8 hover:scale-110 transition-all cursor-pointer"
            alt=""
          />
        </td>
      </tr>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Delete Blog</h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-md text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={deleteBlog}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogTableItem;
