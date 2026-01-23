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
      const { data } = await axios.post("/api/admin/aprrove-comment", {
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
        "Are you sure want to delete this comment?"
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
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">{BlogDate}</td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            // Tambahkan properti onClick

            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt=""
              className="transition-all w-5 hover:scale-110 cursor-pointer"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt=""
            className="transition-all w-5 hover:scale-110 cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
