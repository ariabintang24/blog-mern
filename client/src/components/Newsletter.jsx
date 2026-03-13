import React from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault(); // mencegah redirect / reload

    // sementara hanya tampilkan pesan
    toast.success("Thank you for subscribing!");
  };

  return (
    <section className="px-6 my-32">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl py-12 px-6 sm:px-10 text-center">
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-3">
          Never Miss a Blog!
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Subscribe to get the latest updates, new tech, and exclusive news.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xl mx-auto h-12 overflow-hidden"
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="flex-1 min-w-0 px-4 border border-gray-300 border-r-0 rounded-l-lg
            outline-none focus:ring-2 focus:ring-primary text-gray-600"
          />

          <button
            type="submit"
            className="px-4 sm:px-8 whitespace-nowrap bg-primary text-white
            rounded-r-lg hover:bg-primary/90 transition font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
