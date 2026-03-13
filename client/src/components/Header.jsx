import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { input, setInput, setSearched } = useAppContext();

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    setSearched(true);
  };

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 ">
          {/* <p>New: AI Feature Integrated</p>
          <img src={assets.star_icon} className="w-2.5" alt="" /> */}
        </div>

        <h1 className="text-3xl sm:text-6xl sm:leading-16 text-gray-700 font-semibold">
          Your Own <span className="text-primary">Blogging</span> <br />
          Platform
        </h1>

        <p className="sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500 my-6">
          This is your space to think out loud, to share what matters, and to
          write without filters.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search for blogs"
            className="w-full pl-4 outline-none"
          />

          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <img
        src={assets.gradientBackground}
        className="absolute -top-50 -z-1 opacity-50"
        alt=""
      />
    </div>
  );
};

export default Header;
