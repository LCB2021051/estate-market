import React, { useEffect, useState } from "react";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log("Data Error: ", data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        console.log("Error:", error.message);
      }
    };
    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image Upload failed (max 2 mb per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload only 6 images");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Progress : ", progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, checked, value } = e.target;
    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
    } else if (["parking", "furnished", "offer"].includes(id)) {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image!");
      if (formData.regularPrice < formData.discountedPrice)
        return setError("Discounted price must be lower!");

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setError(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-[#28506F]">
        Updating Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row gap-4"
        onSubmit={handleCreateListing}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg text-[#28506F] border-[#28506F]"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg text-[#28506F] border-[#28506F]"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg text-[#28506F] border-[#28506F]"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            {["sale", "rent", "parking", "furnished", "offer"].map((id) => (
              <div className="flex gap-2" key={id}>
                <input
                  type="checkbox"
                  id={id}
                  className="w-5 accent-[#28506F]"
                  onChange={handleChange}
                  checked={formData[id] || formData.type === id}
                />
                <span className="text-[#28506F] capitalize">{id}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-[#28506F] font-semibold">
            Images:
            <span className="text-gray-500 font-normal ml-2">
              The first image will be the cover (max 6 images)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-[#28506F] rounded-lg text-[#28506F] w-full"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-[#28506F] border border-[#28506F] rounded hover:shadow-lg"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formData.imageUrls.map((url, i) => (
            <div
              key={url}
              className="flex justify-between p-3 border border-gray-200 items-center"
            >
              <img
                src={url}
                alt="listing"
                className="w-32 h-16 object-contain rounded-lg"
              />
              <button
                onClick={() => handleDeleteImage(i)}
                className="p-3 text-red-500 uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
          {error && <p className="text-red-500">{error}</p>}
          <button
            disabled={loading || uploading}
            className="p-3 bg-[#28506F] text-[#F1F0BA] rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default UpdateListing;
