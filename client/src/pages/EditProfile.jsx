import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FiCamera } from "react-icons/fi";
import { useRef } from "react";

const EditProfile = () => {
  const { user, axios, token, setUser, navigate } = useAppContext();

  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { data } = await axios.put("/api/user/update-profile", formData);

    //   console.log("UPDATED USER FROM BACKEND:", data.user);

      if (data.success) {
        toast.success("Profile updated");

        setUser(data.user); // 🔥 update global state

        localStorage.setItem("user", JSON.stringify(data.user)); // 🔥 persist

        navigate("/profile");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("ERROR FULL:", err);
      console.log("ERROR RESPONSE:", err.response);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-xl font-semibold">Edit Profile</h1>
            <p className="text-sm text-gray-500">
              Update your personal information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-600 self-start">Avatar</label>
            <div className="relative group w-28 h-28">
              <input
                id="avatarInput"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {/* Avatar */}
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm border">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-gray-600">
                    {name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <FiCamera className="text-white" size={18} />
              </div>
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-400 mt-2">
              Click image to upload new avatar
            </p>

            {/* Remove */}
            {preview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs cursor-pointer text-red-500 mt-1 hover:underline"
              >
                Remove avatar
              </button>
            )}
          </div>

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className="cursor-pointer mt-2 bg-gradient-to-r from-primary to-indigo-500 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
