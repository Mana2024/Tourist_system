import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  { icon: "🧠", title: "AI Recommendations", desc: "Smart suggestions based on your interests, budget, and travel duration." },
  { icon: "🗺️", title: "Interactive Maps", desc: "Explore tourist spots on an interactive OpenStreetMap with your live location." },
  { icon: "✈️", title: "Trip Planner", desc: "Auto-generate a day-by-day itinerary tailored just for you." },
  { icon: "📸", title: "35+ Destinations", desc: "Waterfalls, caves, sacred forests, cultural villages and more." },
];

const HIGHLIGHTS = [
  { img: "/images/nohkalikai.jpg", name: "Nohkalikai Falls", tag: "Waterfalls" },
  { img: "/images/doubledecker.jpg", name: "Double Decker Root Bridge", tag: "Adventure" },
  { img: "/images/mawlynnong.jpg", name: "Mawlynnong Village", tag: "Culture" },
  { img: "/images/dawki.jpg", name: "Dawki River", tag: "Nature" },
  { img: "/images/laitlum.jpg", name: "Laitlum Canyons", tag: "Trekking" },
  { img: "/images/mawsmai.jpg", name: "Mawsmai Cave", tag: "Caves" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            <span className="text-2xl">🏔️</span>
            <span>Meghalaya Tourism</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-25">
          <Image src="/images/shillongview.jpg" alt="Meghalaya landscape" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center w-full">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
            🌿 Abode of Clouds · Northeast India
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover the Magic of
            <br />
            <span className="text-emerald-400">Meghalaya</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            AI-powered travel recommendations for waterfalls, caves, living root bridges,
            and cultural gems across India&apos;s most scenic state.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base">
              Start Exploring →
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base">
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
            {[["35+", "Destinations"], ["12", "Districts"], ["AI", "Powered"], ["Free", "Entry Options"]].map(([val, lbl]) => (
              <div key={lbl} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-3xl font-bold text-emerald-400">{val}</p>
                <p className="text-sm text-slate-400 mt-1">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to explore Meghalaya</h2>
            <p className="text-gray-500 max-w-xl mx-auto">One platform for smart travel planning with AI, maps, and curated destination data.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-gray-500">From world-record waterfalls to Asia&apos;s cleanest village</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIGHLIGHTS.map(h => (
              <div key={h.name} className="relative rounded-2xl overflow-hidden group h-64 shadow-sm">
                <Image src={h.img} alt={h.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-medium bg-emerald-500 text-white px-2 py-1 rounded-full">{h.tag}</span>
                  <p className="text-white font-semibold mt-1">{h.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/register" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              View All 35+ Places →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to plan your Meghalaya adventure?</h2>
          <p className="text-emerald-100 mb-8">Register free and let our AI build your perfect itinerary.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-sm">
        <p className="text-white font-semibold mb-2 text-base">🏔️ Meghalaya Tourism</p>
        <p>Built for travellers who love nature, adventure, and culture in Northeast India.</p>
      </footer>
    </div>
  );
}
