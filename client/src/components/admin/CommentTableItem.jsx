import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt).toDateString();

  const { axios } = useAppContext();

  // Membuat fungsionalitas Approved
  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Membuat fungsionalitas Delete comments
  const deleteComment = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure want to delete this comment?",
      );
      if (!confirm) return;

      const { data } = await axios.post("/api/admin/delete-comment", {
        id: _id,
      });

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-200 hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium text-gray-600">Blog:</span>{" "}
            <span className="text-gray-800">{comment?.blog?.title ?? "-"}</span>
          </p>

          <p>
            <span className="font-medium text-gray-600">User:</span>{" "}
            <span className="text-gray-800">
              {comment?.user?.username ?? "-"}
            </span>
          </p>

          <p>
            <span className="font-medium text-gray-600">Comment:</span>{" "}
            <span className="text-gray-700">{comment.content}</span>
          </p>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500 max-sm:hidden">
        {BlogDate}
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt="approve"
              className="w-5 cursor-pointer hover:scale-125 transition"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}

          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="delete"
            className="w-5 hover:scale-110 cursor-pointer transition"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
