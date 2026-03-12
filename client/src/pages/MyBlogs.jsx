import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const MyBlogs = () => {
  const { axios, user } = useAppContext();

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

  useEffect(() => {
    if (user) fetchMyBlogs();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">My Articles</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven't written any articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
