import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFaliure,
  deleteUserFaliure,
  deleteUserSuccess,
  deleteUserStart,
  signOutStart,
  signOutFaliure,
  signOutSuccess,
} from "../redux/user/userSlice.js";
import { app } from "../firebase.js";

function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userUpdated, setUserUpdated] = useState(false);
  const [listings, setListings] = useState([]);
  const [showListingsError, setShowListingError] = useState(false);
  const [deleteListingError, setDeleteListingError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFaliure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUserUpdated(true);
    } catch (error) {
      dispatch(updateUserFaliure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFaliure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFaliure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFaliure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFaliure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(data.message);
        return;
      }
      if (data.length === 0) return setShowListingError("Nothing to show");
      setListings(data);
    } catch (error) {
      setShowListingError(error.message);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      setDeleteListingError(false);

      const res = await fetch(`api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        setDeleteListingError(data.message);
        return;
      }

      setListings((prev) => prev.filter((listing) => listing._id !== id));
      setDeleteListingError(false);
    } catch (error) {
      setDeleteListingError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-[#28506F]">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          className="h-24 w-24 rounded-full object-cover hover:cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (must be less than 2.0 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-[#28506F]">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-500">Upload Complete</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg border-[#28506F] text-[#28506F]"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg border-[#28506F] text-[#28506F]"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg border-[#28506F] text-[#28506F]"
          onChange={handleChange}
        />
        <button className="bg-[#28506F] text-[#F1F0BA] rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-[#28506F] text-[#F1F0BA] p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDelete}
          className="text-red-700 cursor-pointer hover:underline"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer hover:underline"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-500 mt-5">
        {userUpdated ? "Updated Successfully!" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-[#28506F] w-full hover:underline"
      >
        Show Listings
      </button>
      <div className="p-3 flex flex-col gap-4">
        <h1 className="text-center text-2xl font-semibold text-[#28506F]">
          Your Listings
        </h1>
        {showListingsError && (
          <p className="text-red-700 mt-5 text-center truncate">
            {showListingsError}
          </p>
        )}
        {listings &&
          listings.length > 0 &&
          listings.map((listing) => (
            <div
              className="p-3 flex justify-between gap-4 border border-[#28506F] rounded-lg items-center"
              key={listing._id}
            >
              <Link to={`/listings/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing_image"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listings/${listing._id}`}
                className="flex-1 text-[#28506F] font-semibold hover:underline truncate"
              >
                <p>{listing.name}</p>
              </Link>
              {deleteListingError && (
                <p className="text-red-600">Error Deleting</p>
              )}
              <div className="flex flex-row items-center gap-6">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase">Edit</button>
                </Link>
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-600 uppercase"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Profile;
