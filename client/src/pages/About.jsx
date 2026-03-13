import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      {" "}
      {/* <Navbar /> */}
      {/* Hero / Intro */}
      <section className="max-w-4xl mx-auto text-center mt-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-800">
          About Our Blog
        </h1>

        <p className="text-gray-500 mt-6 leading-relaxed">
          This blog is a place where ideas, knowledge, and stories come
          together. We created this platform to share insights, tutorials, and
          perspectives that help people learn something new and stay curious
          about the world of technology and creativity.
        </p>
      </section>
      {/* Illustration */}
      <div className="flex justify-center mt-12 px-6">
        <img
          src={assets.blog}
          alt="about"
          className="w-full max-w-3xl rounded-xl shadow-md"
        />
      </div>
      {/* What you'll find here */}
      <section className="max-w-5xl mx-auto mt-20 px-6 grid md:grid-cols-3 gap-10 text-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Insightful Articles
          </h3>
          <p className="text-gray-500 text-sm">
            Explore thoughtful articles about technology, startups, creativity,
            and the evolving digital world.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Practical Knowledge
          </h3>
          <p className="text-gray-500 text-sm">
            Learn through tutorials, guides, and experiences designed to make
            complex ideas easier to understand.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Inspiring Stories
          </h3>
          <p className="text-gray-500 text-sm">
            Discover perspectives and personal insights that inspire curiosity
            and continuous learning.
          </p>
        </div>
      </section>
      {/* Stats */}
      <section className="mt-20 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 text-center gap-6">
          <div>
            <h3 className="text-3xl font-semibold text-primary">100+</h3>
            <p className="text-gray-500 text-sm mt-1">Articles Published</p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-primary">50+</h3>
            <p className="text-gray-500 text-sm mt-1">Topics Covered</p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-primary">10k+</h3>
            <p className="text-gray-500 text-sm mt-1">Monthly Readers</p>
          </div>
        </div>
      </section>
      {/* Mission */}
      <section className="max-w-3xl mx-auto text-center py-20 px-6">
        <h2 className="text-3xl font-semibold text-gray-800">Our Mission</h2>

        <p className="text-gray-500 mt-4 leading-relaxed">
          We believe knowledge grows when it is shared. Our mission is to create
          a space where ideas can be expressed freely and learning becomes part
          of everyday curiosity.
        </p>

        <p className="text-gray-500 mt-3">
          Whether you're here to learn, explore, or simply read something
          interesting, we're glad you're here.
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default About;
