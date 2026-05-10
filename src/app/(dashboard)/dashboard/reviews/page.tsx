"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Search, Filter, MoreHorizontal, ExternalLink, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

const reviews = [
  { id: 1, customer: "Sarah Johnson", rating: 5, platform: "google", content: "Absolutely fantastic service! The team was professional, on time, and the work was exceptional. Highly recommend!", date: new Date("2026-05-08"), responded: false },
  { id: 2, customer: "Mike Thompson", rating: 4, platform: "google", content: "Great experience overall. Quick response time and quality work.", date: new Date("2026-05-07"), responded: true },
  { id: 3, customer: "Emily Davis", rating: 5, platform: "facebook", content: "We've used this company multiple times and they've always delivered.", date: new Date("2026-05-06"), responded: false },
  { id: 4, customer: "James Wilson", rating: 2, platform: "google", content: "Disappointed with the service. Showed up late and the work wasn't what was promised. Need to fix this ASAP.", date: new Date("2026-05-05"), responded: true, urgent: true },
  { id: 5, customer: "Anna Martinez", rating: 5, platform: "google", content: "Best service I've ever used. Professional, clean, and efficient!", date: new Date("2026-05-04"), responded: true },
  { id: 6, customer: "Robert Chen", rating: 1, platform: "yelp", content: "Terrible experience. Never booking again. Very unprofessional.", date: new Date("2026-05-03"), responded: false, urgent: true },
  { id: 7, customer: "Lisa Anderson", rating: 3, platform: "google", content: "Decent service but could be more punctual. Price was fair.", date: new Date("2026-05-02"), responded: false },
];

const filterOptions = ["All", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star", "Negative"];

export default function ReviewsPage() {
  const [filter, setFilter] = useState("All");

  const negativeReviews = reviews.filter(r => r.rating <= 2);
  const needsResponse = reviews.filter(r => !r.responded);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <p className="text-amber-100 text-sm">Average Rating</p>
            </div>
            <p className="text-3xl font-bold mt-2">4.2</p>
            <p className="text-amber-100 text-sm mt-2">+0.3 this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <p className="text-emerald-100 text-sm">5-Star Reviews</p>
            </div>
            <p className="text-3xl font-bold mt-2">{reviews.filter(r => r.rating >= 5).length}</p>
            <p className="text-emerald-100 text-sm mt-2">57% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <p className="text-blue-100 text-sm">Needs Response</p>
            </div>
            <p className="text-3xl font-bold mt-2">{needsResponse.length}</p>
            <p className="text-blue-100 text-sm mt-2">Pending replies</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-red-100 text-sm">Negative</p>
            </div>
            <p className="text-3xl font-bold mt-2">{negativeReviews.length}</p>
            <p className="text-red-100 text-sm mt-2">Require action</p>
          </CardContent>
        </Card>
      </div>

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
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        isNegative 
                          ? "bg-gradient-to-br from-red-500 to-red-600" 
                          : "bg-gradient-to-br from-indigo-500 to-purple-500"
                      }`}>
                        {review.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-slate-900">{review.customer}</span>
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
                          {review.content}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-sm text-slate-400">{formatDate(review.date)}</span>
                          {review.responded ? (
                            <span className="text-sm text-emerald-600 font-medium">✓ Responded</span>
                          ) : (
                            <span className="text-sm text-amber-600 font-medium">Needs response</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {review.responded ? (
                        <Button variant="outline" size="sm">
                          View Response
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className={isNegative ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600"}
                        >
                          {isNegative ? "Urgent Response" : "Respond"}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}