import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";

const CommentTableItem = ({ comment, fetchComments }) => {
  const [deleteId, setDeleteId] = useState(null);

  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt).toDateString();

  const { axios } = useAppContext();

  const handleDeleteClick = () => {
    setDeleteId(_id);
  };

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
      const { data } = await axios.post("/api/admin/delete-comment", {
        id: deleteId,
      });

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <tr className="border-y border-gray-200 hover:bg-gray-50 transition">
        <td className="px-6 py-4">
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium text-gray-600">Blog:</span>{" "}
              <span className="text-gray-800">
                {comment?.blog?.title ?? "-"}
              </span>
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
              onClick={handleDeleteClick}
              src={assets.bin_icon}
              alt="delete"
              className="w-5 hover:scale-110 cursor-pointer transition"
            />
          </div>
        </td>
      </tr>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Delete Comment</h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this comment?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-md text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={deleteComment}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentTableItem;
