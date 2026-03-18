import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Register = () => {
  const { axios, setToken, setUser, navigate } = useAppContext();

  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const { data } = await axios.post("/api/auth/register", formData);

      if (data.success) {
        setToken(data.token);
        setUser(data.user);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        axios.defaults.headers.common["Authorization"] = data.token;

        toast.success("Account created successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">
            Join us and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-gray-600">
                  {name ? name[0].toUpperCase() : "U"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm">
              {/* Upload */}
              <label className="text-primary cursor-pointer hover:underline">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </label>

              {/* Remove */}
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar(null)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-primary text-white py-3 rounded-lg font-medium
                     hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
