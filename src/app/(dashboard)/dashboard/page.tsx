"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  TrendingUp, 
  MessageCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ThumbsUp,
  Plus
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

// Mock data for demo
const stats = [
  { 
    label: "Total Reviews", 
    value: "247", 
    change: "+12%", 
    trend: "up",
    icon: Star 
  },
  { 
    label: "Average Rating", 
    value: "4.8", 
    change: "+0.2", 
    trend: "up",
    icon: TrendingUp 
  },
  { 
    label: "This Month", 
    value: "34", 
    change: "+8%", 
    trend: "up",
    icon: MessageCircle 
  },
  { 
    label: "Response Rate", 
    value: "92%", 
    change: "-3%", 
    trend: "down",
    icon: Clock 
  },
];

const recentReviews = [
  {
    id: 1,
    customer: "Sarah Johnson",
    rating: 5,
    platform: "google",
    content: "Absolutely fantastic service! The team was professional, on time, and the work was exceptional. Highly recommend!",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    responded: false,
  },
  {
    id: 2,
    customer: "Mike Thompson",
    rating: 4,
    platform: "google",
    content: "Great experience overall. Quick response time and quality work. Would recommend to anyone.",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    responded: true,
  },
  {
    id: 3,
    customer: "Emily Davis",
    rating: 5,
    platform: "facebook",
    content: "We've used this company multiple times and they've always delivered. True professionals!",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    responded: false,
  },
  {
    id: 4,
    customer: "James Wilson",
    rating: 2,
    platform: "google",
    content: "Disappointed with the service. Showed up late and the work wasn't what was promised. Would not recommend.",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    responded: true,
  },
];

const pendingActions = [
  { type: "review", message: "New 5-star review from Sarah Johnson", time: "2h ago" },
  { type: "request", message: "Review request sent to Robert Chen", time: "5h ago" },
  { type: "review", message: "New 2-star review from James Wilson", time: "2d ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Here's how your reviews are performing</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.label} className={`animate-in stagger-${index + 1}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  index === 0 ? "bg-amber-50" : 
                  index === 1 ? "bg-emerald-50" : 
                  index === 2 ? "bg-blue-50" : "bg-purple-50"
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    index === 0 ? "text-amber-600" : 
                    index === 1 ? "text-emerald-600" : 
                    index === 2 ? "text-blue-600" : "text-purple-600"
                  }`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Reviews</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                View all
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                        {review.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{review.customer}</span>
                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${
                                  star <= review.rating 
                                    ? "text-amber-400 fill-amber-400" 
                                    : "text-slate-200"
                                }`} 
                              />
                            ))}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            review.platform === 'google' 
                              ? "bg-blue-50 text-blue-700" 
                              : "bg-indigo-50 text-indigo-700"
                          }`}>
                            {review.platform}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{review.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-slate-400">{formatRelativeTime(review.date)}</span>
                          {!review.responded && (
                            <span className="text-xs text-amber-600 font-medium">Pending response</span>
                          )}
                        </div>
                      </div>

                      {/* Quick Action */}
                      {!review.responded && (
                        <Button size="sm" variant="outline" className="shrink-0">
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Review Request
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add New Customer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Respond to Reviews
              </Button>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingActions.map((action, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    action.type === 'review' ? "bg-emerald-500" : "bg-blue-500"
                  }`} />
                  <div>
                    <p className="text-sm text-slate-700">{action.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{action.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            {[5,4,3,2,1].map((rating) => {
              const count = rating === 5 ? 142 : rating === 4 ? 68 : rating === 3 ? 22 : rating === 2 ? 10 : 5;
              const percentage = Math.round((count / 247) * 100);
              return (
                <div key={rating} className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-700">{rating}</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{count} reviews ({percentage}%)</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}