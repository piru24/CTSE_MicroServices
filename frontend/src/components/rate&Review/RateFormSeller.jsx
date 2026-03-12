import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import swal from "sweetalert";
import { useParams, useNavigate } from "react-router-dom";
import { MdStarRate, MdFastfood } from "react-icons/md";

const RateFormSeller = () => {
  const [rateType] = useState("seller");
  const [rateId, setRateId] = useState("");
  const [rateValue, setRateValue] = useState(0);
  const [review, setReview] = useState("");

  const navigate = useNavigate();
  const { sellerName, id } = useParams();

  useEffect(() => {
    setRateId(id);
  }, [id]);

  const submitData = async (event) => {
    event.preventDefault();

    if (rateValue !== 0) {
      const reviewData = {
        seller_id: id,
        rate: rateValue,
        reviews: review,
      };
      const response = await axios.post(
        "http://localhost:8079/review/addReview",
        reviewData,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        swal({
          title: "Successful",
          text: "Rate and Review was added successfully",
          icon: "success",
        }).then(() => navigate("/products"));
      } else {
        swal({
          title: "Error",
          text: "Rate posting failed",
          icon: "error",
        });
      }
    } else {
      swal({
        title: "Invalid",
        text: "Rate is required. Please select from stars",
        icon: "warning",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="bg-white/90 shadow-2xl rounded-3xl p-8 max-w-lg mx-auto border border-green-100">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-to-tr from-yellow-400 to-green-400 rounded-full h-20 w-20 flex items-center justify-center shadow-lg mb-2">
              <MdStarRate className="text-white text-5xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-green-800 mb-2 text-center">
              Rate {rateType.charAt(0).toUpperCase() + rateType.slice(1)}
            </h2>
            <div className="text-gray-500 text-center text-sm mb-2">
              {rateType}Id: <span className="font-semibold">{rateId}</span>
            </div>
            <h3 className="text-lg font-semibold text-green-700 mb-4 text-center flex items-center gap-2">
              <MdFastfood className="text-yellow-400" /> Seller Name: {sellerName}
            </h3>
          </div>
          <form onSubmit={submitData} className="space-y-6">
            {/* Rating Stars */}
            <div className="flex justify-center">
              <ReactStars
                count={5}
                value={rateValue}
                onChange={(value) => setRateValue(value)}
                size={50}
                activeColor="#ffd700"
              />
            </div>
            <div className="text-center text-green-700 font-semibold">
              {rateValue > 0 && (
                <>
                  <span>Rating: {rateValue} / 5</span>
                  {review && (
                    <span className="block mt-1 text-gray-500 italic">
                      Review: {review}
                    </span>
                  )}
                </>
              )}
            </div>
            {/* Comment Section */}
            <div>
              <label
                htmlFor="review"
                className="block text-gray-700 font-semibold mb-2"
              >
                Add Comment
              </label>
              <textarea
                id="review"
                name="review"
                value={review}
                onChange={(event) => setReview(event.target.value)}
                className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                rows="4"
                placeholder="Write your review here..."
              ></textarea>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center gap-2 text-lg"
              >
                <MdStarRate className="text-2xl" /> Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RateFormSeller;
