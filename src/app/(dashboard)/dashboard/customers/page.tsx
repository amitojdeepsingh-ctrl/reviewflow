"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Phone, Mail, MoreHorizontal, MessageCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

export default function CustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) fetchCustomers();
  }, [user]);

  async function fetchCustomers() {
    setLoading(true);
    const { data } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    setCustomers(data || []);
    setLoading(false);
  }

  async function addCustomer() {
    if (!user || !newCustomer.name) {
      setError("Please enter a name");
      return;
    }
    setAdding(true);
    setError("");
    
    const { error } = await supabase.from("customers").insert({
      user_id: user.id,
      name: newCustomer.name,
      phone: newCustomer.phone || null,
      email: newCustomer.email || null,
      address: newCustomer.address || null,
      notes: newCustomer.notes || null,
    });

    if (error) {
      setError(error.message);
    } else {
      fetchCustomers();
      setShowAddDialog(false);
      setNewCustomer({ name: "", phone: "", email: "", address: "", notes: "" });
    }
    setAdding(false);
  }

  async function sendReviewRequest(customerId: string, method: "sms" | "email" = "sms") {
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
      console.error("Error:", error);
    } finally {
      setSendingTo(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">Manage your customers</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
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
            <p className="text-3xl font-bold mt-2">{customers.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <p className="text-blue-100 text-sm">With Phone</p>
            <p className="text-3xl font-bold mt-2">{customers.filter(c => c.phone).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <p className="text-purple-100 text-sm">With Email</p>
            <p className="text-3xl font-bold mt-2">{customers.filter(c => c.email).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <p className="text-amber-100 text-sm">Ready for SMS</p>
            <p className="text-3xl font-bold mt-2">{customers.filter(c => c.phone || c.email).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      {customers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No customers yet</h3>
            <p className="text-slate-500 mt-2">Add your first ADS Immigration customer to get started</p>
            <Button onClick={() => setShowAddDialog(true)} className="mt-4 bg-indigo-600">
              Add First Customer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Notes</th>
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
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-3.5 h-3.5" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Mail className="w-3.5 h-3.5" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{customer.notes || "-"}</span>
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
                              disabled={sendingTo === customer.id || (!customer.phone && !customer.email)}
                            >
                              {sendingTo === customer.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              Send Request
                            </Button>
                          )}
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
      )}

      {/* Add Customer Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Customer</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="john@email.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Notes</label>
                <input
                  type="text"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Visa application, PR, etc."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addCustomer} disabled={adding} className="flex-1 bg-indigo-600">
                {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {adding ? "Adding..." : "Add Customer"}
              </Button>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}