import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const FeedbackReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Fetch services owned by the current user
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('id, name, category')
          .eq('owner_id', session.user.id);

        if (servicesError) throw servicesError;

        if (!services || services.length === 0) {
          setReviews([]);
          setLoading(false);
          return;
        }

        // Fetch reviews for these services
        const serviceIds = services.map(s => s.id);
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('service_reviews')
          .select(`
            id,
            rating,
            description,
            created_at,
            author:author_id (
              display_name,
              username,
              avatar_url
            ),
            service:service_id (
              name,
              category
            )
          `)
          .in('service_id', serviceIds)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        
        setReviews(reviewsData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedback reviews:', err);
        setError(err.message || 'Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full border-4 border-t-[#00B70D] border-gray-200 w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-center p-6">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#1a2e1e] tracking-tight">
            Service Reviews
          </h1>
          <p className="mt-2 text-gray-500 text-sm font-medium">
            See what your clients are saying about your services
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews yet for your services. Encourage your clients to leave feedback!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {review.author?.avatar_url ? (
                        <img 
                          src={review.author.avatar_url} 
                          alt={`${review.author.display_name}'s avatar`} 
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">{review.author?.username?.slice(0, 2).toUpperCase() ?? '?'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1a2e05]">{review.author?.display_name || 'Anonymous'}</h3>
                          <p className="text-xs text-gray-500">
                            Reviewed {new Date(review.created_at).toLocaleDateString()} • 
                            <span className="text-[#00B70D] font-medium">{review.service?.name}</span> 
                            (<span className="text-gray-400">{review.service?.category}</span>)
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={`text-[18px] ${star <= review.rating ? 'text-[#FF5722]' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.description}</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-4 text-xs text-gray-500 border-t border-gray-50">
                  Review ID: #{review.id} • Service ID: #{review.service_id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackReviews;