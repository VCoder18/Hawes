import React, { useState } from "react";
import { CheckCircle, RotateCcw, Send } from "lucide-react";
import bannerImg from "@/images/coastal_banner.png";

export default function FeedbackPage() {
  const defaultText =
    "What did you like?\nWhat could be better?\nWhat needs to develop more ?";

  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>(defaultText);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 500) {
      setReviewText(val);
    }
  };

  const handleReset = () => {
    setRating(4);
    setHoverRating(null);
    setReviewText(defaultText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call and premium feeling micro-animation
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 flex flex-col items-center">
      {/* Title Header */}
      <h1 className="text-[#FF5900] text-3xl md:text-[40px] font-bold text-center mb-8 tracking-wide animate-fade-in">
        Tell us about your Experience
      </h1>

      {/* Main Review Card */}
      <div className="w-full bg-white rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#F5F5F4] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

        {/* Cover Photo */}
        <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] overflow-hidden">
          <img
            src={bannerImg}
            alt="Algerian Coast Scenery"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col items-center">

          {/* Share thoughts section */}
          <h2 className="text-[#0D2805] text-xl sm:text-2xl font-bold text-center leading-tight">
            Share your thoughts on
          </h2>
          <span className="text-[#3C5A85] text-lg sm:text-xl font-extrabold tracking-widest mt-1 mb-6 block uppercase transition-all hover:text-[#1E3A8A]">
            BUSINESS_NAME
          </span>

          {/* Interactive Star Container */}
          <div className="bg-[#FFF3ED] px-8 py-4 rounded-3xl flex gap-3 sm:gap-4 items-center justify-center shadow-sm border border-[#FFE5D9] transition-all hover:scale-102">
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const isActive = hoverRating !== null ? starIndex <= hoverRating : starIndex <= rating;
              return (
                <button
                  type="button"
                  key={starIndex}
                  onClick={() => setRating(starIndex)}
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="focus:outline-none transition-transform duration-150 hover:scale-120 active:scale-95"
                >
                  <svg
                    className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${isActive ? "fill-[#FF5900] stroke-[#FF5900]" : "fill-transparent stroke-[#FF5900] stroke-2"
                      }`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499c.195-.39.73-.39.927 0l2.184 4.327 4.718.66c.44.06.617.588.296.886l-3.384 3.242.827 4.643c.08.438-.39.76-.777.56l-4.157-2.145-4.157 2.145c-.388.2-.857-.122-.777-.56l.827-4.643-3.384-3.242c-.321-.298-.143-.826.297-.887l4.718-.66 2.184-4.327z"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Detailed text area section */}
          <div className="w-full mt-10">
            <h3 className="text-[#0D2805] text-base sm:text-lg font-bold text-slate-800 mb-3 text-center sm:text-left">
              Tell us more details about your experience with us
            </h3>

            <div className="relative">
              <textarea
                value={reviewText}
                onChange={handleTextChange}
                rows={5}
                className="w-full bg-[#F3F4F6] text-slate-700 text-sm sm:text-base p-5 rounded-2xl border-2 border-transparent focus:border-[#FF5900]/40 focus:bg-white outline-none transition-all duration-300 shadow-inner resize-none font-medium leading-relaxed"
                placeholder="What did you like?&#10;What could be better?&#10;What needs to develop more?"
              />

              {/* Character Counter */}
              <div className="absolute right-4 bottom-3 text-xs sm:text-sm text-slate-400 font-semibold tracking-wider">
                {reviewText.length} / 500 characters
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="w-full mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-[220px] bg-[#FF5900] hover:bg-[#E04E00] text-white py-4 rounded-full font-bold text-[17px] shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full sm:w-[220px] bg-[#00B70D] hover:bg-[#009E0B] text-white py-4 rounded-full font-bold text-[17px] shadow-lg shadow-green-500/10 hover:shadow-green-500/25 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Review
            </button>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-stone-100 flex flex-col items-center text-center transform transition-all duration-300 scale-100 animate-scale-up">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-[#00B70D]" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Review Submitted!
            </h3>

            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Thank you for sharing your valuable thoughts. Your rating of <span className="font-semibold text-[#FF5900]">{rating} stars</span> helps BUSINESS_NAME improve their service.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#00B70D] hover:bg-[#009E0B] text-white py-3 rounded-xl font-bold transition-all active:scale-98 cursor-pointer shadow-md shadow-green-500/10"
            >
              Back to Services
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
