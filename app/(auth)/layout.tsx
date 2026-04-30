import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-end p-12">
        <div className="absolute inset-0">
          <Image
            src="/images/umngot.jpg"
            alt="Meghalaya"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">🏔️</span>
            <span className="text-white font-bold text-xl">Meghalaya Tourism</span>
          </div>
          <blockquote className="text-slate-200 text-lg leading-relaxed">
            &ldquo;Where clouds are born and rivers run crystal-clear —
            experience the Northeast India like never before.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
