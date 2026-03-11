import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { axios, setToken, setUser, navigate } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        setUser(data.user);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        axios.defaults.headers.common["Authorization"] = data.token;

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />

          <button className="bg-primary text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
