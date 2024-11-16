import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";

function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);

  console.log(saleListings);

  return (
    <div>
      {/* Top */}
      <div className="flex flex-col gap-6 p-28 px-8 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">Perfect</span> <br />{" "}
          place with ease{" "}
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          The real estate market is the ultimate destination to find your dream
          home. With endless options, it caters to every lifestyle and
          preference.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-600 hover:underline"
        >
          Let's get Started...
        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing.imageUrls[0]}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[400px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-slate-600 font-semibold text-3xl">
                Trending Offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-blue-700 hover:underline text-sm"
              >
                Show more Offer
              </Link>
            </div>
            <div className="flex flex-row gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing.name} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-slate-600 font-semibold text-3xl">
                For Sale
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-blue-700 hover:underline text-sm"
              >
                Show more Offer
              </Link>
            </div>
            <div className="flex flex-row gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing.name} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-slate-600 font-semibold text-3xl">
                For Rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-blue-700 hover:underline text-sm"
              >
                Show more Offer
              </Link>
            </div>
            <div className="flex flex-row gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
