import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = () => {
  const { axios, token } = useAppContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return false;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const { data } = await axios.patch(
        "/api/user/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (data.success) {
        toast.success("Password updated successfully");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message); // contoh: current password salah
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition";

  const EyeIcon = ({ show, toggle }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
    >
      {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <FiLock size={18} />
          </div>

          <div>
            <h1 className="text-xl font-semibold">Change Password</h1>
            <p className="text-sm text-gray-500">Keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Current Password */}
          <div className="relative">
            <label className="text-sm text-gray-600">Current Password</label>

            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />

            <EyeIcon
              show={showCurrent}
              toggle={() => setShowCurrent(!showCurrent)}
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="text-sm text-gray-600">New Password</label>

            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />

            <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm text-gray-600">Confirm Password</label>

            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />

            <EyeIcon
              show={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
            />
          </div>

          {/* Helper */}
          <p className="text-xs text-gray-400">
            Use at least 6 characters and avoid using the same password.
          </p>

          {/* Button */}
          <button
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-primary to-indigo-500 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
