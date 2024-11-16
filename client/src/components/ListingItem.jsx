import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function ListingItem({ listing }) {
  return (
    <div className="bg-[#F8F9FA] shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[320px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://avantecture.com/wp-content/uploads/2021/10/Bruderhaus-Nr-2-aussen-13.jpg"
          }
          alt="listing_image"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-[#28506F] truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="w-4 h-4 text-[#F4C430]" />
            <p className="text-[#495057] truncate w-full pb-1">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-[#6C757D] line-clamp-4">
            {listing.description}
          </p>
          <p className="text-[#28506F] mt-2 font-semibold flex items-center">
            ₹
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-In")
              : listing.regularPrice.toLocaleString("en-In")}
            {listing.type === "rent" && " /month"}
          </p>
          <div className="text-[#495057] flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingItem;
