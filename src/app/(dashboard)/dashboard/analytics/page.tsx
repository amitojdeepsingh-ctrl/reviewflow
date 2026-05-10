"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, TrendingUp, MessageCircle, Clock, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    pending: 0,
    google: 0,
    facebook: 0,
    yelp: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    // Fetch reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating, platform");

    // Fetch pending requests
    const { data: requests } = await supabase
      .from("review_requests")
      .select("id")
      .eq("status", "pending");

    if (reviews?.length) {
      const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
      const fiveStars = reviews.filter(r => r.rating === 5).length;
      const google = reviews.filter(r => r.platform === 'google').length;
      const facebook = reviews.filter(r => r.platform === 'facebook').length;
      const yelp = reviews.filter(r => r.platform === 'yelp').length;

      setStats({
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        fiveStars,
        pending: requests?.length || 0,
        google,
        facebook,
        yelp
      });
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const platformData = stats.totalReviews > 0 ? [
    { platform: "Google", reviews: stats.google, avgRating: stats.avgRating || 4.5, percentage: Math.round((stats.google / stats.totalReviews) * 100) },
    { platform: "Facebook", reviews: stats.facebook, avgRating: stats.avgRating || 4.3, percentage: Math.round((stats.facebook / stats.totalReviews) * 100) },
    { platform: "Yelp", reviews: stats.yelp, avgRating: stats.avgRating || 4.2, percentage: Math.round((stats.yelp / stats.totalReviews) * 100) },
  ] : [];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Track your review performance over time</p>
        </div>
        <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Last 12 months</option>
        </select>
      </div>

      {stats.totalReviews === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No Analytics Yet</h3>
            <p className="text-slate-500 mt-2">Add customers and send review requests to see your analytics.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stats.avgRating || "-"}</p>
                    <p className="text-sm text-slate-500">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalReviews}</p>
                    <p className="text-sm text-slate-500">Total Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stats.fiveStars}</p>
                    <p className="text-sm text-slate-500">5-Star Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
                    <p className="text-sm text-slate-500">Pending Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Breakdown */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-6">Reviews by Platform</h3>
              <div className="space-y-6">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="flex items-center gap-4">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900">{platform.platform}</span>
                        <span className="text-sm text-slate-500">{platform.reviews} reviews</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${platform.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-12 text-right">
                      {platform.avgRating}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}