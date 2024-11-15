import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError(false);
        const user = await fetch(`/api/user/${listing.userRef}`);
        const data = await user.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setLandlord(data);
      } catch (err) {
        setError("Error fetching user data");
      }
    };
    fetchUser();
  }, [listing.userRef]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {landlord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={5}
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your message here"
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}

export default Contact;
