import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, axios, setUser, navigate } = useAppContext();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.put("/api/user/update-profile", {
        name,
        username,
        avatar,
      });

      if (data.success) {
        toast.success("Profile updated");

        // update global user (biar navbar langsung berubah)
        setUser(data.user);

        navigate(`/profile/${data.user.username}`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Username */}
        <div>
          <label className="text-sm text-gray-600">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="text-sm text-gray-600">Avatar URL</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Preview */}
        {avatar && (
          <div className="flex items-center gap-3 mt-2">
            <img src={avatar} className="w-14 h-14 rounded-full object-cover" />
            <span className="text-sm text-gray-500">Preview</span>
          </div>
        )}

        <button
          disabled={loading}
          className="mt-4 bg-primary text-white py-2.5 rounded-md hover:opacity-90"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
