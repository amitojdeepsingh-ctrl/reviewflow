"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Search, Filter, MoreHorizontal, ExternalLink, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  platform: string;
  rating: number;
  content: string | null;
  review_date: string | null;
  responded: boolean;
}

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const negativeReviews = reviews.filter(r => r.rating <= 2);
  const needsResponse = reviews.filter(r => !r.responded);

  const filterOptions = ["All", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star", "Negative"];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500 mt-1">Manage and respond to all your reviews</p>
        </div>
      </div>

      {/* Alert Banner for Negative Reviews */}
      {negativeReviews.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-900">{negativeReviews.length} Negative Review{negativeReviews.length > 1 ? "s" : ""} Need Attention</p>
              <p className="text-sm text-red-700">Respond quickly to resolve these issues</p>
            </div>
          </div>
          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            View Negative Reviews
          </Button>
        </div>
      )}

      {/* Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <p className="text-amber-100 text-sm">Average Rating</p>
              </div>
              <p className="text-3xl font-bold mt-2">
                {reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "-"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <p className="text-emerald-100 text-sm">5-Star Reviews</p>
              </div>
              <p className="text-3xl font-bold mt-2">{reviews.filter(r => r.rating >= 5).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <p className="text-blue-100 text-sm">Needs Response</p>
              </div>
              <p className="text-3xl font-bold mt-2">{needsResponse.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <p className="text-red-100 text-sm">Negative</p>
              </div>
              <p className="text-3xl font-bold mt-2">{negativeReviews.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Rating Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === option
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {option === "Negative" ? `⚠️ ${option}` : option}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No Reviews Yet</h3>
            <p className="text-slate-500 mt-2">Reviews will appear here when customers leave them.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {reviews.map((review) => {
                const isNegative = review.rating <= 2;
                const showCard = filter === "All" || 
                  (filter === "Negative" && isNegative) ||
                  filter === `${review.rating} Star`;
                
                if (!showCard) return null;

                return (
                  <div 
                    key={review.id} 
                    className={`p-6 hover:bg-slate-50 transition-colors ${isNegative ? "bg-red-50/50 border-l-4 border-red-400" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          {isNegative && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Needs Attention
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            review.platform === 'google' ? "bg-blue-50 text-blue-700" :
                            review.platform === 'facebook' ? "bg-indigo-50 text-indigo-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {review.platform}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          {review.content || "No review content"}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-sm text-slate-400">{review.review_date || "Recent"}</span>
                          {review.responded ? (
                            <span className="text-sm text-emerald-600 font-medium">✓ Responded</span>
                          ) : (
                            <span className="text-sm text-amber-600 font-medium">Needs response</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}