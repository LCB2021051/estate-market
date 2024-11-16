import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  return (
    <header className="bg-[#28506F] shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-[#F1F0BA]">estate</span>
            <span className="text-white">Market</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-[#f8f7e9] p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 text-[#28506F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-[#28506F]" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-[#F1F0BA] hover:underline">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-[#F1F0BA] hover:underline">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="h-7 rounded-full w-7 object-cover border-2 border-[#F1F0BA]"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="sm:inline text-[#F1F0BA] hover:underline">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
