import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

import { FiEdit, FiTrash2, FiAlertTriangle } from "react-icons/fi";

const Profile = () => {
  const params = useParams();
  const { axios, navigate, user: loggedUser } = useAppContext();
  const username = params.username || loggedUser?.username;

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const isOwner = loggedUser?.username === username;

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/api/user/${username}`);

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const { data } = await axios.get(`/api/blog/user/${username}`);

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async () => {
    try {
      const { data } = await axios.post("/api/blog/delete", { id: deleteId });

      if (data.success) {
        toast.success("Blog deleted");
        fetchUserBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    if (!username) return;

    fetchProfile();
    fetchUserBlogs();
  }, [username]);

  if (loading || !user) return <Loader />;

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-semibold">
            {user.name?.[0]?.toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              {blogs.length} Articles
            </p>
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-xl font-semibold mb-6">My Blogs</h2>

        {blogs.length === 0 ? (
          <p className="text-gray-500">
            This user hasn't written any blogs yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="relative">
                {/* Action Icons */}
                {isOwner && (
                  <div className="absolute top-3 right-3 z-20 flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-blog/${blog._id}`)}
                      className="bg-white p-2 rounded-full shadow hover:bg-blue-500 hover:text-white transition"
                    >
                      <FiEdit size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteId(blog._id)}
                      className="bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}

                <BlogCard blog={blog} disableNavigation />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm">
            <div className="flex items-center gap-3 mb-3 text-red-500">
              <FiAlertTriangle size={22} />
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Blog
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteBlog}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
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

export default Profile;
