import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

const Blog = () => {
  const { slug } = useParams();
  const { axios, token, user, navigate } = useAppContext();

  // console.log("slug:", slug);

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [content, setContent] = useState("");

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${slug}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchComments = async () => {
    if (!data?._id) return;
    try {
      const { data: res } = await axios.post("/api/blog/comments", {
        blogId: data._id,
      });

      if (res.success) {
        setComments(res.comments);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to comment");
      navigate("/login");
      return;
    }

    if (!content.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: data._id,
        content,
      });

      if (data.success) {
        toast.success("Comment submitted for review");
        setContent("");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteComment = async () => {
    try {
      const { data } = await axios.post("/api/blog/delete-comment", {
        id: deleteCommentId,
      });

      if (data.success) {
        toast.success("Comment deleted");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteCommentId(null);
    }
  };

  // useEffect(() => {
  //   fetchBlogData();
  //   fetchComments();
  // }, [id]);

  useEffect(() => {
    fetchBlogData();
  }, [slug]);

  useEffect(() => {
    if (data?._id) {
      fetchComments();
    }
  }, [data]);

  return (
    <>
      {data ? (
        <div className="relative">
          <img
            src={assets.gradientBackground}
            alt=""
            className="absolute -top-40 opacity-40 -z-10"
          />

          {/* Article Header */}
          <header className="max-w-3xl mx-auto text-center px-6 mt-20">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
              {data.title}
            </h1>

            <p className="mt-4 text-gray-500 text-lg">{data.subTitle}</p>

            <div className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center justify-center gap-1 text-sm">
                <span className="text-gray-500">By</span>

                <span
                  onClick={() => navigate(`/profile/${data.author?.username}`)}
                  className="cursor-pointer text-primary hover:underline font-medium"
                >
                  {data.author?.name || "Admin"}
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span>
                Published {Moment(data.createdAt).format("D MMM YYYY")}
              </span>
              <span className="text-gray-300">•</span>
              <span>
                {data.updatedAt && data.updatedAt !== data.createdAt
                  ? `Updated ${Moment(data.updatedAt).fromNow()}`
                  : "No updates yet"}
              </span>
            </div>
          </header>

          {/* Article Body */}
          <main className="max-w-3xl mx-auto px-6 mt-12 mb-24">
            <img
              src={data.image}
              alt={data.title}
              className="w-full rounded-xl shadow-md mb-10"
            />

            <article
              dangerouslySetInnerHTML={{ __html: data.description }}
              className="rich-text text-gray-700 leading-relaxed text-[17px]"
            />

            {/* Comments */}
            <section className="mt-20">
              <h2 className="text-xl font-semibold mb-6">
                Comments ({comments.length})
              </h2>

              {comments.length === 0 && (
                <p className="text-gray-700 text-sm">
                  No comments yet. Be the first to comment.
                </p>
              )}

              <div className="flex flex-col gap-4">
                {comments.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {item.user?.avatar ? (
                          <img
                            src={item.user.avatar}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-600">
                            {item.user?.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <p className="font-medium text-sm">{item.user?.name}</p>

                      {/* Time */}
                      <span className="text-xs text-gray-400 ml-auto">
                        {Moment(item.createdAt).fromNow()}
                      </span>

                      {/* Delete */}
                      {user && item.user?._id === user.id && (
                        <FiTrash2
                          size={15}
                          onClick={() => setDeleteCommentId(item._id)}
                          className="text-red-500 cursor-pointer hover:scale-110"
                        />
                      )}
                    </div>

                    <p className="text-sm text-gray-600">{item.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Add Comment */}
            <section className="mt-16">
              <h2 className="text-xl font-semibold mb-4">Add your comment</h2>

              <form
                onSubmit={addComment}
                className="flex flex-col gap-4 max-w-lg"
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your comment..."
                  required
                  className="border border-gray-300 rounded-lg p-4 h-40 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  type="submit"
                  className="bg-primary text-white rounded-md py-2 px-6 w-fit hover:opacity-90 transition"
                >
                  Submit
                </button>
              </form>
            </section>
          </main>

          <Footer />
        </div>
      ) : (
        <Loader />
      )}

      {/* DELETE COMMENT MODAL */}
      {deleteCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Comment
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteCommentId(null)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteComment}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
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

export default Blog;
