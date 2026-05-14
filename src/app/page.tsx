"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Star, MessageCircle, BarChart3, Zap, ArrowRight, 
  CheckCircle, Globe, Shield, Clock, Users, Smartphone
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF5FF]">
      {/* App Coming Soon Banner */}
      <div className="bg-[#7C3AED] text-white py-3 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <Smartphone className="w-5 h-5" />
          <span className="font-medium">Android & iOS App Coming Soon</span>
          <span className="text-violet-200 text-sm ml-2">— Manage your reviews on the go!</span>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#4C1D95]">ReviewManager</span>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="#features" className="text-sm text-slate-600 hover:text-[#7C3AED] transition-colors cursor-pointer">Features</Link>
            <Link href="#how-it-works" className="text-sm text-slate-600 hover:text-[#7C3AED] transition-colors cursor-pointer">How it works</Link>
            <Link href="#pricing" className="text-sm text-slate-600 hover:text-[#7C3AED] transition-colors cursor-pointer">Pricing</Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 lg:pt-48 lg:pb-32 relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C3AED]/10 text-[#7C3AED] rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Trusted by 500+ local businesses
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-[#4C1D95] leading-[1.1] tracking-tight font-[family-name:var(--font-fira-code)]">
            Get more 5-star reviews.<br />
            <span className="text-[#7C3AED]">
              Less stress.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mt-8 max-w-2xl mx-auto leading-relaxed font-[family-name:var(--font-fira-sans)]">
            Stop losing customers to competitors with better reviews. 
            ReviewManager helps local businesses get more reviews with less effort — 
            automated, simple, and effective.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-12">
            <Link href="/signup">
              <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white text-lg px-8 h-14">
                Get 50% Off — $19/month
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-slate-500 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>

          {/* Social proof */}
          <div className="mt-16 flex items-center justify-center gap-8">
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-1">4.9/5 from 200+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#4C1D95] font-[family-name:var(--font-fira-code)]">How it works</h2>
            <p className="text-slate-600 mt-4 text-lg">Three steps to more 5-star reviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect your business", desc: "Link your Google Business Profile in one click", icon: Globe },
              { step: "02", title: "Automatic requests", desc: "We send SMS review requests after every job", icon: MessageCircle },
              { step: "03", title: "Watch reviews grow", desc: "Sit back as 5-star reviews roll in", icon: Star },
            ].map((item, i) => (
              <div key={i} className="relative bg-[#FAF5FF] p-8 rounded-2xl border border-slate-200 hover:border-[#7C3AED] transition-all duration-200 group cursor-pointer">
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-[#7C3AED]" />
                </div>
                <h3 className="text-xl font-bold text-[#4C1D95]">{item.title}</h3>
                <p className="text-slate-600 mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#4C1D95] font-[family-name:var(--font-fira-code)]">Everything you need</h2>
            <p className="text-slate-600 mt-4 text-lg">Powerful features, simple to use</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, title: "Automated Requests", desc: "Send review requests via SMS or email automatically after each job" },
              { icon: Star, title: "All Platforms", desc: "Manage Google, Facebook, and Yelp reviews from one dashboard" },
              { icon: BarChart3, title: "Smart Analytics", desc: "Track ratings, responses, and trends over time" },
              { icon: Zap, title: "AI Responses", desc: "Get AI-generated responses to reviews in one click" },
              { icon: Shield, title: "Negative Review Alerts", desc: "Get instant alerts for 1-2 star reviews so you can fix issues fast" },
              { icon: Clock, title: "Response Tracking", desc: "Never miss a review with automated follow-ups and reminders" },
              { icon: Users, title: "Customer CRM", desc: "Track all your customers and their review history" },
              { icon: Globe, title: "Multi-platform", desc: "One dashboard for all your review platforms" },
              { icon: CheckCircle, title: "Templates", desc: "Customizable message templates for every scenario" },
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-slate-200 hover:border-[#7C3AED] transition-all duration-200 bg-white cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <h3 className="text-lg font-semibold text-[#4C1D95]">{feature.title}</h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#4C1D95] font-[family-name:var(--font-fira-code)]">Simple pricing</h2>
            <p className="text-slate-600 mt-4 text-lg">No hidden fees, no contracts</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-[#7C3AED] rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F97316] rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  50% OFF — Limited Time
                </div>
                
                <p className="text-violet-200 font-medium mt-6">Pro Plan</p>
                
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-6xl font-bold">$19</span>
                  <span className="text-2xl text-violet-300 line-through">$39</span>
                  <span className="text-violet-200 text-xl">/month</span>
                </div>
                <p className="text-violet-200/80 text-sm mt-2">billed annually ($228/year — save $240!)</p>
                
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
                  <Button className="w-full mt-10 bg-white text-[#7C3AED] hover:bg-violet-50 font-semibold text-lg h-14">
                    Claim 50% Off — 7 Days Left
                  </Button>
                </Link>
                
                <p className="text-center text-violet-200 text-sm mt-4">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F97316]/10 text-[#F97316] rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            50% OFF — Limited Time Offer
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#4C1D95] font-[family-name:var(--font-fira-code)]">Ready to get more reviews?</h2>
          <p className="text-slate-600 mt-4 text-lg">Lock in 50% off when you sign up today — only $19/month</p>
          <div className="mt-10">
            <Link href="/signup">
              <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white text-lg px-10 h-14">
                Get 50% Off Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">Offer ends in 7 days • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#7C3AED] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#4C1D95]">ReviewManager</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 ReviewManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}