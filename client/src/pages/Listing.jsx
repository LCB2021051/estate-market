import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setError(false);
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (!data || data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && (
        <p className="text-[#28506F] my-7 text-2xl text-center">Loading...</p>
      )}
      {error && (
        <p className="text-red-600 my-7 text-center">Something went wrong</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls && listing.imageUrls.length > 0 ? (
              listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[500px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))
            ) : (
              <p>No images available</p>
            )}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-[#F1F0BA] cursor-pointer shadow-lg">
            <FaShare
              className="text-[#28506F]"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-[#F1F0BA] p-2 text-[#28506F]">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold text-[#28506F]">
              {listing.name} - ₹ {listing.regularPrice.toLocaleString("en-In")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-[#28506F] text-sm">
              <FaMapMarkerAlt className="text-[#28506F]" />
              {listing.address || "Address Unavailable"}
            </p>
            <div className="flex gap-4">
              <p className="bg-[#28506F] w-full max-w-[200px] text-[#F1F0BA] text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-[#28506F] w-full max-w-[200px] text-[#F1F0BA] text-center p-1 rounded-md">
                  ₹ {listing.discountedPrice.toLocaleString("en-In")}
                </p>
              )}
            </div>
            <p className="text-[#28506F]">
              <span className="font-semibold text-black">Description - </span>
              {listing.description || "No description available"}
            </p>
            <ul className="text-[#28506F] font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-[#28506F] text-[#F1F0BA] rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}

export default Listing;
