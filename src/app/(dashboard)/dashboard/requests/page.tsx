"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Users, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const requests = [
  { id: 1, customer: "Sarah Johnson", phone: "(555) 123-4567", message: "Thanks for choosing us! Would you mind leaving us a review?", sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), status: "sent" },
  { id: 2, customer: "Mike Thompson", phone: "(555) 234-5678", message: "Hope you're happy with our service! A quick review would help us a lot.", sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), status: "delivered" },
  { id: 3, customer: "Emily Davis", phone: "(555) 345-6789", message: "Thanks for the work! We'd love your feedback on Google.", sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), status: "clicked" },
  { id: 4, customer: "James Wilson", phone: "(555) 456-7890", message: "Apologies for the issues. We'd love a chance to make it right.", sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000), status: "failed" },
];

const templates = [
  { id: 1, name: "Standard Request", message: "Thanks for choosing us! Would you mind leaving us a review? {link}" },
  { id: 2, name: "Friendly Follow-up", message: "Hope you're happy with our service! A quick review would help us a lot. {link}" },
  { id: 3, name: "Apology Request", message: "We apologize if anything wasn't perfect. Your feedback helps us improve. {link}" },
];

export default function RequestsPage() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review Requests</h1>
          <p className="text-slate-500 mt-1">Send SMS review requests to your customers</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Send className="w-4 h-4 mr-2" />
          New Request
        </Button>
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
                <p className="text-2xl font-bold text-slate-900">156</p>
                <p className="text-sm text-slate-500">Sent this month</p>
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
                <p className="text-2xl font-bold text-slate-900">89%</p>
                <p className="text-sm text-slate-500">Delivery rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">34%</p>
                <p className="text-sm text-slate-500">Response rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">23%</p>
                <p className="text-sm text-slate-500">Review rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
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
                            {request.status === 'failed' && <XCircle className="w-3 h-3" />}
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{request.message}</p>
                        <p className="text-xs text-slate-400 mt-2">{formatRelativeTime(request.sentAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">{request.phone}</p>
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