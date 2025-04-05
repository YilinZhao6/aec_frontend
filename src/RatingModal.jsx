import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

const RatingModal = ({ onClose, userId, conversationId }) => {
  const [qualityRating, setQualityRating] = useState(0);
  const [understandabilityRating, setUnderstandabilityRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasExistingRating, setHasExistingRating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExistingRating = async () => {
      if (!userId || !conversationId) return;

      try {
        const response = await fetch('https://backend-ai-cloud-explains.onrender.com/user_stats/check_rating_exists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            conversation_id: conversationId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.rating_exists) {
            setHasExistingRating(true);
            onClose();
          }
        }
      } catch (error) {
        console.error('Error checking rating status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay before checking to ensure component is properly mounted
    const timeoutId = setTimeout(() => {
      checkExistingRating();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [userId, conversationId, onClose]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/user_stats/add_user_rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          conversation_id: conversationId,
          quality_rating: qualityRating,
          understandability: understandabilityRating,
          further_comments: comments
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Increase the delay before closing
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, setRating, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  // Don't render anything while checking existing rating
  if (isLoading) {
    return null;
  }

  // Don't render if there's already a rating
  if (hasExistingRating) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your feedback helps us improve Hyperknow for everyone.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  We'd Love Your Feedback!
                </h2>
                <p className="text-gray-600">
                  Your ratings help us improve and provide better explanations for everyone.
                  We greatly appreciate you taking the time to share your thoughts!
                </p>
              </div>

              <div className="space-y-6">
                <StarRating
                  rating={qualityRating}
                  setRating={setQualityRating}
                  label="Overall Quality"
                />

                <StarRating
                  rating={understandabilityRating}
                  setRating={setUnderstandabilityRating}
                  label="Understandability"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Comments
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your thoughts with us..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !qualityRating || !understandabilityRating}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    isSubmitting || !qualityRating || !understandabilityRating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;