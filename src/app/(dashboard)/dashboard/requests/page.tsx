"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Users, Clock, CheckCircle, XCircle, MessageCircle, Mail, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewRequest {
  id: string;
  customer_id: string | null;
  status: string;
  request_method: string | null;
  message: string | null;
  sent_at: string | null;
  created_at: string;
}

export default function RequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data } = await supabase
      .from("review_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'sent');
  const respondedRequests = requests.filter(r => r.status === 'responded');
  
  const displayRequests = filter === "all" ? requests : 
    filter === "pending" ? pendingRequests : respondedRequests;

  const sentCount = requests.filter(r => r.status === 'sent').length;
  const deliveredCount = requests.filter(r => r.status === 'delivered').length;
  const clickedCount = requests.filter(r => r.status === 'clicked').length;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review Requests</h1>
          <p className="text-slate-500 mt-1">Track your review request history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Email Blast
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Send className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
                <p className="text-sm text-slate-500">Total Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{deliveredCount}</p>
                <p className="text-sm text-slate-500">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{pendingRequests.length}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clickedCount}</p>
                <p className="text-sm text-indigo-200">Clicked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Request History</CardTitle>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${filter === "all" ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${filter === "pending" ? "bg-amber-100 text-amber-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter("responded")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${filter === "responded" ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              Responded
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No Requests Yet</h3>
              <p className="text-slate-500 mt-2">Go to Customers and send review requests to see history here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayRequests.map((request) => (
                <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                          request.status === 'sent' ? 'bg-blue-50 text-blue-700' :
                          request.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                          request.status === 'clicked' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {request.status === 'sent' && <Send className="w-3 h-3" />}
                          {request.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                          {request.status === 'clicked' && <MessageCircle className="w-3 h-3" />}
                          {request.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.request_method === 'sms' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {request.request_method || 'sms'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{request.message || "Review request sent"}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {request.sent_at ? new Date(request.sent_at).toLocaleDateString() : new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}