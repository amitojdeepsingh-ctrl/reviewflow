"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, MessageCircle, Clock, Globe } from "lucide-react";

export default function AnalyticsPage() {
  const platformData = [
    { platform: "Google", reviews: 189, avgRating: 4.9, percentage: 76 },
    { platform: "Facebook", reviews: 42, avgRating: 4.7, percentage: 17 },
    { platform: "Yelp", reviews: 16, avgRating: 4.5, percentage: 7 },
  ];

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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">4.8</p>
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
                <p className="text-3xl font-bold text-slate-900">+0.3</p>
                <p className="text-sm text-slate-500">vs Last Month</p>
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
                <p className="text-3xl font-bold text-slate-900">247</p>
                <p className="text-sm text-slate-500">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">2.4h</p>
                <p className="text-sm text-slate-500">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Rating Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[4.2, 4.4, 4.3, 4.5, 4.6, 4.7, 4.8, 4.7, 4.8, 4.9, 4.8, 4.8].map((rating, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md"
                    style={{ height: `${(rating / 5) * 200}px` }}
                  />
                  <span className="text-xs text-slate-400">M{i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {platformData.map((platform) => (
              <div key={platform.platform}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{platform.platform}</span>
                  </div>
                  <span className="text-sm text-slate-500">{platform.reviews} reviews</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${platform.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-slate-900">{platform.avgRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}