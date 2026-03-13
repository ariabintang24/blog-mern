import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import Moment from "moment";
import Navbar from "../components/Navbar";

const MyBlogs = () => {
  const { axios, user, navigate } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const { data } = await axios.get(`/api/blog/user/${user.username}`);

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const { data } = await axios.post("/api/blog/delete", { id });

      if (data.success) {
        toast.success("Blog deleted");
        fetchMyBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) fetchMyBlogs();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-8">My Articles</h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500">You haven't written any articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="relative group cursor-pointer"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                <BlogCard blog={blog} />

                {/* Action icons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-blog/${blog._id}`);
                    }}
                    className="bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-blue-500 hover:text-white transition"
                  >
                    <FiEdit size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlog(blog._id);
                    }}
                    className="bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBlogs;
