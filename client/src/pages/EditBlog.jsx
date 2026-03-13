import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../assets/assets";
import { useParams } from "react-router-dom";
import Quill from "quill";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import "quill/dist/quill.snow.css";

const EditBlog = () => {
  const { id } = useParams();
  const { axios, navigate } = useAppContext();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);

      if (data.success) {
        const blog = data.blog;

        setTitle(blog.title);
        setSubTitle(blog.subTitle);
        setCategory(blog.category);
        setOldImage(blog.image);

        if (quillRef.current) {
          quillRef.current.root.innerHTML = blog.description;
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsUpdating(true);

      const blog = {
        id,
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post("/api/blog/update", formData);

      if (data.success) {
        toast.success("Blog updated successfully");
        navigate(`/blog/${id}`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }

    fetchBlog();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-900">Edit Blog</h1>
            <p className="text-gray-500 text-sm mt-2">
              Update your article content.
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-8">
            {/* Thumbnail */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Thumbnail
              </p>

              <label
                htmlFor="image"
                className="inline-flex flex-col items-center justify-center
                w-40 h-28 border-2 border-dashed border-gray-300
                rounded-lg cursor-pointer hover:border-primary transition"
              >
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : oldImage || assets.upload_area
                  }
                  className="max-h-20 object-contain"
                />

                <input
                  hidden
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>

            {/* Title */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Title</p>

              <input
                type="text"
                placeholder="Article title"
                className="w-full border border-gray-300 rounded-lg p-3
                focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Subtitle */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Subtitle</p>

              <input
                type="text"
                placeholder="Short description"
                className="w-full border border-gray-300 rounded-lg p-3
                focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Content</p>

              <div
                ref={editorRef}
                className="bg-white border border-gray-300 rounded-lg min-h-[220px] p-3"
              ></div>
            </div>

            {/* Category */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Category</p>

              <select
                className="border border-gray-300 rounded-lg p-3
                focus:outline-none focus:ring-2 focus:ring-primary"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {blogCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-gray-100">
              <button
                disabled={isUpdating}
                className="bg-primary text-white py-3 px-8 rounded-lg
                hover:bg-primary/90 transition font-medium"
              >
                {isUpdating ? "Updating..." : "Update Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBlog;
