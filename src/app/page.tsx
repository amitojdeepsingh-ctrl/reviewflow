"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Star, MessageCircle, BarChart3, Zap, ArrowRight, 
  CheckCircle, Globe, Zap as Zap2, Shield, Clock, Users, Smartphone, Download
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* App Coming Soon Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <Smartphone className="w-5 h-5" />
          <span className="font-medium">Android & iOS App Coming Soon</span>
          <span className="text-indigo-200 text-sm ml-2">— Manage your reviews on the go!</span>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100/50 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ReviewManager</span>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">How it works</Link>
            <Link href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 lg:pt-48 lg:pb-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/80 backdrop-blur rounded-full text-sm text-indigo-700 font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Trusted by 500+ local businesses
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight animate-fade-in stagger-1">
            Get more 5-star reviews.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Less stress.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 mt-8 max-w-2xl mx-auto leading-relaxed animate-fade-in stagger-2">
            Stop losing customers to competitors with better reviews. 
            ReviewManager helps local businesses get more reviews with less effort — 
            automated, simple, and effective.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in stagger-3">
            <Link href="/signup">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 h-14 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
                Get 50% Off — $19/month
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-slate-400 mt-6 animate-fade-in stagger-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>

          {/* Social proof */}
          <div className="mt-16 flex items-center justify-center gap-8 animate-fade-in stagger-5">
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-medium text-slate-600">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-1">4.9/5 from 200+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">How it works</h2>
            <p className="text-slate-500 mt-4 text-lg">Three steps to more 5-star reviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect your business", desc: "Link your Google Business Profile in one click", icon: Globe },
              { step: "02", title: "Automatic requests", desc: "We send SMS review requests after every job", icon: MessageCircle },
              { step: "03", title: "Watch reviews grow", desc: "Sit back as 5-star reviews roll in", icon: Star },
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group">
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Everything you need</h2>
            <p className="text-slate-500 mt-4 text-lg">Powerful features, simple to use</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, title: "Automated Requests", desc: "Send review requests via SMS or email automatically after each job" },
              { icon: Star, title: "All Platforms", desc: "Manage Google, Facebook, and Yelp reviews from one dashboard" },
              { icon: BarChart3, title: "Smart Analytics", desc: "Track ratings, responses, and trends over time" },
              { icon: Zap2, title: "AI Responses", desc: "Get AI-generated responses to reviews in one click" },
              { icon: Shield, title: "Negative Review Alerts", desc: "Get instant alerts for 1-2 star reviews so you can fix issues fast" },
              { icon: Clock, title: "Response Tracking", desc: "Never miss a review with automated follow-ups and reminders" },
              { icon: Users, title: "Customer CRM", desc: "Track all your customers and their review history" },
              { icon: Globe, title: "Multi-platform", desc: "One dashboard for all your review platforms" },
              { icon: CheckCircle, title: "Templates", desc: "Customizable message templates for every scenario" },
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Simple pricing</h2>
            <p className="text-slate-500 mt-4 text-lg">No hidden fees, no contracts</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/80 rounded-full text-sm font-medium animate-pulse">
                  <Zap className="w-4 h-4" />
                  50% OFF — Limited Time
                </div>
                
                <p className="text-indigo-100 font-medium mt-6">Pro Plan</p>
                
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-6xl font-bold">$19</span>
                  <span className="text-2xl text-indigo-300 line-through">$39</span>
                  <span className="text-indigo-200 text-xl">/month</span>
                </div>
                <p className="text-indigo-100/80 text-sm mt-2">billed annually ($228/year — save $240!)</p>
                
                <ul className="mt-10 space-y-4">
                  {[
                    "Unlimited customers",
                    "Unlimited review requests", 
                    "AI-powered responses",
                    "Google & Facebook integration",
                    "Analytics & reporting",
                    "Priority support",
                    "14-day free trial"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/signup">
                  <Button className="w-full mt-10 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold text-lg h-14 shadow-lg">
                    Claim 50% Off — 7 Days Left
                  </Button>
                </Link>
                
                <p className="text-center text-indigo-200 text-sm mt-4">
                  Offer ends in 7 days • 14-day free trial • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            50% OFF — Limited Time Offer
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Ready to get more reviews?</h2>
          <p className="text-slate-500 mt-4 text-lg">Lock in 50% off when you sign up today — only $19/month</p>
          <div className="mt-10">
            <Link href="/signup">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-10 h-14 shadow-xl shadow-indigo-500/25">
                Get 50% Off Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-4">Offer ends in 7 days • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">ReviewManager</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 ReviewManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}