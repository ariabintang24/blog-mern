import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, blog_data, comments_data } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Blog = () => {
  const { id } = useParams();
  // Tambahkan ini
  const { axios } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const fetchBlogData = async () => {
    // const data = blog_data.find((item) => item._id === id);
    // setData(data);

    // Code yang sebelumnya diganti dengan ini
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchComments = async () => {
    // setComments(comments_data);

    // Code yang sebelumnya diganti dengan ini
    try {
      const { data } = await axios.post("/api/blog/comments", { blogId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    // Tambahkan ini
    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
        name,
        content,
      });

      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-40 opacity-40 -z-10"
      />

      <Navbar />

      {/* Article Header */}
      <header className="max-w-3xl mx-auto text-center px-6 mt-20">
        <p className="text-primary text-sm font-medium">
          Published on {Moment(data.createdAt).format("D MMMM YYYY")}
        </p>

        <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
          {data.title}
        </h1>

        <p className="mt-4 text-gray-500 text-lg">{data.subTitle}</p>

        <span className="inline-block mt-5 px-4 py-1 text-sm rounded-full bg-primary/10 text-primary">
          Blog Article
        </span>
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
            {comments.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} className="w-6" />
                  <p className="font-medium">{item.name}</p>
                  <span className="text-xs text-gray-400 ml-auto">
                    {Moment(item.createdAt).fromNow()}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Add Comment */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Add your comment</h2>

          <form onSubmit={addComment} className="flex flex-col gap-4 max-w-lg">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary outline-none"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comment"
              required
              className="border border-gray-300 rounded-md p-3 h-40 focus:ring-2 focus:ring-primary outline-none"
            />

            <button
              type="submit"
              className="bg-primary text-white rounded-md py-2 px-6 w-fit hover:opacity-90 transition"
            >
              Submit
            </button>
          </form>
        </section>

        {/* Share */}
        <section className="mt-20">
          <p className="font-semibold mb-4">Share this article</p>

          <div className="flex gap-4">
            <img
              src={assets.facebook_icon}
              className="w-10 cursor-pointer hover:scale-110 transition"
            />
            <img
              src={assets.twitter_icon}
              className="w-10 cursor-pointer hover:scale-110 transition"
            />
            <img
              src={assets.googleplus_icon}
              className="w-10 cursor-pointer hover:scale-110 transition"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;
