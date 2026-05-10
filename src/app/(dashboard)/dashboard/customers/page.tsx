"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Phone, Mail, MoreHorizontal, MessageCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const customers = [
  { id: 1, name: "Sarah Johnson", phone: "(555) 123-4567", email: "sarah@email.com", jobs: 5, lastContact: new Date("2026-05-08"), totalSpent: 1250, lastRequestSent: null },
  { id: 2, name: "Mike Thompson", phone: "(555) 234-5678", email: "mike@email.com", jobs: 3, lastContact: new Date("2026-05-07"), totalSpent: 890, lastRequestSent: "2026-05-01" },
  { id: 3, name: "Emily Davis", phone: "(555) 345-6789", email: "emily@email.com", jobs: 8, lastContact: new Date("2026-05-06"), totalSpent: 2400, lastRequestSent: null },
  { id: 4, name: "James Wilson", phone: "(555) 456-7890", email: "james@email.com", jobs: 2, lastContact: new Date("2026-05-05"), totalSpent: 450, lastRequestSent: null },
  { id: 5, name: "Anna Martinez", phone: "(555) 567-8901", email: "anna@email.com", jobs: 12, lastContact: new Date("2026-05-04"), totalSpent: 4200, lastRequestSent: "2026-04-28" },
  { id: 6, name: "Robert Chen", phone: "(555) 678-9012", email: "robert@email.com", jobs: 1, lastContact: new Date("2026-05-03"), totalSpent: 180, lastRequestSent: null },
  { id: 7, name: "Lisa Anderson", phone: "(555) 789-0123", email: "lisa@email.com", jobs: 6, lastContact: new Date("2026-05-02"), totalSpent: 1850, lastRequestSent: null },
];

export default function CustomersPage() {
  const [sendingTo, setSendingTo] = useState<number | null>(null);
  const [sentTo, setSentTo] = useState<number[]>([]);

  async function sendReviewRequest(customerId: number, method: "sms" | "email" = "sms") {
    setSendingTo(customerId);
    
    try {
      const res = await fetch("/api/send-review-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, method }),
      });

      if (res.ok) {
        setSentTo([...sentTo, customerId]);
        setTimeout(() => setSentTo(sentTo.filter(id => id !== customerId)), 3000);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setSendingTo(null);
    }
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">Manage your customer database</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <p className="text-emerald-100 text-sm">Total Customers</p>
            <p className="text-3xl font-bold mt-2">247</p>
            <p className="text-emerald-100 text-sm mt-2">+12 this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <p className="text-blue-100 text-sm">Active This Month</p>
            <p className="text-3xl font-bold mt-2">89</p>
            <p className="text-blue-100 text-sm mt-2">36% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <p className="text-purple-100 text-sm">Avg. Jobs per Customer</p>
            <p className="text-3xl font-bold mt-2">3.2</p>
            <p className="text-purple-100 text-sm mt-2">+0.4 this quarter</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <p className="text-amber-100 text-sm">Requests Sent</p>
            <p className="text-3xl font-bold mt-2">156</p>
            <p className="text-amber-100 text-sm mt-2">63% response rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Jobs</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Total Spent</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Last Request</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-slate-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 font-medium">{customer.jobs}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 font-medium">${customer.totalSpent.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.lastRequestSent ? (
                        <span className="text-sm text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {formatDate(new Date(customer.lastRequestSent))}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {sentTo.includes(customer.id) ? (
                          <Button variant="outline" size="sm" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Sent!
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => sendReviewRequest(customer.id)}
                            disabled={sendingTo === customer.id}
                          >
                            {sendingTo === customer.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            Send Request
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          Message
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}