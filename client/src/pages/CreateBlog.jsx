import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../assets/assets";
import Quill from "quill";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CreateBlog = () => {
  const { axios, navigate } = useAppContext();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isAdding, setIsAdding] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!title || !image) {
      toast.error("Title and image are required");
      return;
    }

    try {
      setIsAdding(true);

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished: false,
      };

      const formData = new FormData();

      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);

      if (data.success) {
        toast.success("Blog submitted for review");

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Write a new article</h1>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
        {/* Thumbnail */}
        <div>
          <p className="mb-2">Thumbnail</p>

          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              className="w-32 cursor-pointer rounded"
            />

            <input
              hidden
              id="image"
              type="file"
              required
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* Title */}
        <div>
          <p className="mb-2">Title</p>

          <input
            type="text"
            placeholder="Article title"
            className="w-full border p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <div>
          <p className="mb-2">Subtitle</p>

          <input
            type="text"
            placeholder="Short description"
            className="w-full border p-3 rounded"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />
        </div>

        {/* Editor */}
        <div>
          <p className="mb-2">Content</p>

          <div
            ref={editorRef}
            className="bg-white border rounded min-h-[200px]"
          ></div>
        </div>

        {/* Category */}
        <div>
          <p className="mb-2">Category</p>

          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {blogCategories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          disabled={isAdding}
          className="bg-primary text-white py-3 px-6 rounded w-fit"
        >
          {isAdding ? "Publishing..." : "Publish Article"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
