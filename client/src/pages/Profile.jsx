import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const Profile = () => {
  const { username } = useParams();
  const { axios } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProfile();
    fetchUserBlogs();
  }, [username]);

  if (loading || !user) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-semibold">
          {user.name?.[0]?.toUpperCase()}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>

          <p className="text-gray-500">{user.email}</p>

          <p className="text-sm text-gray-400 mt-1">{blogs.length} Articles</p>
        </div>
      </div>

      {/* Section Title */}
      <h2 className="text-xl font-semibold mb-6">My Blogs</h2>

      {/* Blog Grid */}

      {blogs.length === 0 ? (
        <p className="text-gray-500">This user hasn't written any blogs yet.</p>
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

export default Profile;
