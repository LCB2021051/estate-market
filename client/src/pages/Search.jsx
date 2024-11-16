import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (["all", "rent", "sale"].includes(id)) {
      setSidebarData({ ...sidebarData, type: id });
    } else if (["parking", "furnished", "offer"].includes(id)) {
      setSidebarData({ ...sidebarData, [id]: checked });
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebarData({ ...sidebarData, sort, order });
    } else {
      setSidebarData({ ...sidebarData, [id]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebarData).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fetchSidebarData = Object.fromEntries(urlParams.entries());
    const updatedSidebarData = {
      searchTerm: fetchSidebarData.searchTerm || "",
      type: fetchSidebarData.type || "all",
      parking: fetchSidebarData.parking === "true",
      furnished: fetchSidebarData.furnished === "true",
      offer: fetchSidebarData.offer === "true",
      sort: fetchSidebarData.sort || "createdAt",
      order: fetchSidebarData.order || "desc",
    };
    setSidebarData(updatedSidebarData);

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(false);
        setShowMore(false);

        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();

        if (data.success === false) {
          setError("Something went wrong!");
        } else {
          setListings(data);
          setShowMore(data.length > 8);
        }
        setLoading(false);
      } catch (err) {
        setError("Something went wrong!");
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const onShowMoreClick = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", listings.length);
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      if (data.length < 9) setShowMore(false);
      setListings((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Error loading more listings:", err);
      setShowMore(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-3 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-[#28506F]">Search:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="p-3 rounded-lg w-full border text-[#28506F]"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold text-[#28506F]">Type:</label>
            {["all", "rent", "sale"].map((type) => (
              <div className="flex gap-2" key={type}>
                <input
                  type="checkbox"
                  id={type}
                  className="w-5"
                  checked={sidebarData.type === type}
                  onChange={handleChange}
                />
                <span className="text-[#28506F] capitalize">{type}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold text-[#28506F]">Amenities:</label>
            {["parking", "furnished", "offer"].map((amenity) => (
              <div className="flex gap-2" key={amenity}>
                <input
                  type="checkbox"
                  id={amenity}
                  className="w-5"
                  checked={sidebarData[amenity]}
                  onChange={handleChange}
                />
                <span className="text-[#28506F] capitalize">{amenity}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[#28506F]">Sort:</label>
            <select
              id="sort_order"
              className="p-3 rounded-lg border text-[#28506F]"
              defaultValue={"createdAt_desc"}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#28506F] text-[#F1F0BA] p-3 uppercase rounded-lg hover:opacity-95"
          >
            Search
          </button>
        </form>
      </div>

      {/* Listing Results */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 mt-5 text-[#28506F]">
          Listing Results
        </h1>
        <div className="p-5 flex flex-wrap gap-5">
          {error && <p className="text-red-600">{error}</p>}
          {!loading && listings.length === 0 && (
            <p className="text-[#28506F] text-xl uppercase text-center w-full">
              No Listing Found
            </p>
          )}
          {loading && (
            <p className="text-[#28506F] uppercase text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-[#28506F] hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
