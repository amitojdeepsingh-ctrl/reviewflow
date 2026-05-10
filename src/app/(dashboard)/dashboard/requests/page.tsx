"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Users, Clock, CheckCircle, XCircle, MessageCircle, Mail, RefreshCw, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const requests = [
  { id: 1, customer: "Sarah Johnson", phone: "(555) 123-4567", email: "sarah@email.com", message: "Thanks for choosing us! Would you mind leaving us a review?", sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), status: "sent", method: "sms", responded: false },
  { id: 2, customer: "Mike Thompson", phone: "(555) 234-5678", email: "mike@email.com", message: "Hope you're happy with our service! A quick review would help us a lot.", sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), status: "delivered", method: "sms", responded: false },
  { id: 3, customer: "Emily Davis", phone: "(555) 345-6789", email: "emily@email.com", message: "Thanks for the work! We'd love your feedback on Google.", sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), status: "clicked", method: "sms", responded: true },
  { id: 4, customer: "James Wilson", phone: "(555) 456-7890", email: "james@email.com", message: "Apologies for the issues. We'd love a chance to make it right.", sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000), status: "failed", method: "sms", responded: false },
  { id: 5, customer: "Anna Martinez", phone: "(555) 567-8901", email: "anna@email.com", message: "We appreciate your business! A quick review helps us grow.", sentAt: new Date(Date.now() - 72 * 60 * 60 * 1000), status: "delivered", method: "email", responded: false },
  { id: 6, customer: "Robert Chen", phone: "(555) 678-9012", email: "robert@email.com", message: "Thanks for choosing us! Would you mind leaving us a review?", sentAt: new Date(Date.now() - 96 * 60 * 60 * 1000), status: "delivered", method: "email", responded: false },
];

const templates = [
  { id: 1, name: "Standard Request", message: "Thanks for choosing us! Would you mind leaving us a review? {link}" },
  { id: 2, name: "Friendly Follow-up", message: "Hope you're happy with our service! A quick review would help us a lot. {link}" },
  { id: 3, name: "Apology Request", message: "We apologize if anything wasn't perfect. Your feedback helps us improve. {link}" },
  { id: 4, name: "Email Follow-up", message: "Hi {name}! Just following up on our recent service. We'd love your feedback! {link}" },
];

export default function RequestsPage() {
  const [resending, setResending] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");

  const pendingRequests = requests.filter(r => !r.responded);
  const respondedRequests = requests.filter(r => r.responded);
  
  const displayRequests = filter === "all" ? requests : 
    filter === "pending" ? pendingRequests : respondedRequests;

  async function resendRequest(requestId: number) {
    setResending(requestId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResending(null);
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review Requests</h1>
          <p className="text-slate-500 mt-1">Send SMS & email review requests to your customers</p>
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
                <p className="text-sm text-slate-500">Sent this month</p>
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
                <p className="text-sm text-slate-500">Awaiting response</p>
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
                <p className="text-2xl font-bold text-slate-900">{respondedRequests.length}</p>
                <p className="text-sm text-slate-500">Responded</p>
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
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <p className="text-sm text-indigo-200">Ready to resend</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Pending */}
      {pendingRequests.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-indigo-900">Auto-resend to non-responders</p>
                  <p className="text-sm text-indigo-700">{pendingRequests.length} customers haven't responded yet</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100">
                  <Mail className="w-4 h-4 mr-2" />
                  Email All
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4 mr-2" />
                  SMS All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2">
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
              <div className="divide-y divide-slate-100">
                {displayRequests.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900">{request.customer}</span>
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
                            request.method === 'sms' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {request.method === 'sms' ? 'SMS' : 'Email'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{request.message}</p>
                        <p className="text-xs text-slate-400 mt-2">{formatRelativeTime(request.sentAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-sm font-medium text-slate-700">{request.phone}</p>
                        {!request.responded && request.email && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs gap-1"
                            onClick={() => resendRequest(request.id)}
                            disabled={resending === request.id}
                          >
                            {resending === request.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            Resend Email
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Message Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-colors">
                  <p className="font-medium text-slate-900">{template.name}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{template.message}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Create Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}