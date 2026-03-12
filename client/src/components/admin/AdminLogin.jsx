import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { axios, setToken, setUser, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);

        const adminUser = {
          name: "Admin",
          role: "admin",
          username: "admin",
        };

        setUser(adminUser);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(adminUser));

        axios.defaults.headers.common["Authorization"] = data.token;

        navigate("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to manage the system
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 text-gray-700"
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="admin@email.com"
              className="border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              placeholder="Enter your password"
              className="border border-gray-300 p-3 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 font-medium bg-primary text-white rounded-lg
                     hover:bg-primary/90 transition"
          >
            Login to Admin Panel
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Restricted access — administrators only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
