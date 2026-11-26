import Image from "next/image";
import Link from "next/link";  

const MANDALA_DEGREES = [0, 60, 120, 180, 240, 300];

export default function StarterGate() {
  return (
    <main className="relative min-h-screen bg-[#3E3C32] text-[#F5F3EE] flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Subtle Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#26251E_100%)] pointer-events-none" />

      {/* HENNA THEME ART 1: Top-Left Fixed Bridal Mandala Watermark */}
      <svg
        viewBox="0 0 200 200"
        className="fixed -top-16 -left-16 w-72 h-72 sm:w-96 sm:h-96 text-[#C8A458]/15 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="75" />
        <circle cx="100" cy="100" r="55" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="35" />
        {MANDALA_DEGREES.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 100 100)`}>
            <path d="M100 10 Q112 30 100 45 Q88 30 100 10 Z" />
            <path d="M100 45 Q108 60 100 72 Q92 60 100 45 Z" />
            <circle cx="100" cy="6" r="1.5" fill="currentColor" />
          </g>
        ))}
      </svg>

      {/* HENNA THEME ART 2: Bottom-Right Fixed Bridal Mandala Watermark */}
      <svg
        viewBox="0 0 200 200"
        className="fixed -bottom-16 -right-16 w-72 h-72 sm:w-96 sm:h-96 text-[#C8A458]/15 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="75" />
        <circle cx="100" cy="100" r="55" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="35" />
        {MANDALA_DEGREES.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 100 100)`}>
            <path d="M100 10 Q112 30 100 45 Q88 30 100 10 Z" />
            <path d="M100 45 Q108 60 100 72 Q92 60 100 45 Z" />
            <circle cx="100" cy="6" r="1.5" fill="currentColor" />
          </g>
        ))}
      </svg>

      {/* HENNA THEME ART 3: Delicate Henna Leaf Vines (Left & Right Sides) */}
      <svg
        viewBox="0 0 100 300"
        className="hidden md:block fixed left-10 top-1/2 -translate-y-1/2 w-20 h-72 text-[#C8A458]/20 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M50 10 Q30 80 50 150 Q70 220 50 290" />
        <path d="M48 50 Q25 40 20 60 Q35 70 48 50 Z" />
        <path d="M52 95 Q75 85 80 105 Q65 115 52 95 Z" />
        <path d="M48 150 Q25 140 20 160 Q35 170 48 150 Z" />
        <path d="M52 205 Q75 195 80 215 Q65 225 52 205 Z" />
        <path d="M48 250 Q25 240 20 260 Q35 270 48 250 Z" />
      </svg>

      <svg
        viewBox="0 0 100 300"
        className="hidden md:block fixed right-10 top-1/2 -translate-y-1/2 w-20 h-72 text-[#C8A458]/20 pointer-events-none scale-x-[-1]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M50 10 Q30 80 50 150 Q70 220 50 290" />
        <path d="M48 50 Q25 40 20 60 Q35 70 48 50 Z" />
        <path d="M52 95 Q75 85 80 105 Q65 115 52 95 Z" />
        <path d="M48 150 Q25 140 20 160 Q35 170 48 150 Z" />
        <path d="M52 205 Q75 195 80 215 Q65 225 52 205 Z" />
        <path d="M48 250 Q25 240 20 260 Q35 270 48 250 Z" />
      </svg>

      {/* Royal Outer Frame Border */}
      <div className="fixed inset-4 sm:inset-8 border border-[#C8A458]/25 pointer-events-none z-20">
        <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-[#C8A458]" />
        <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-[#C8A458]" />
        <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-[#C8A458]" />
        <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-[#C8A458]" />
      </div>

      {/* Ambient Breathing Golden Aura */}
      <div className="absolute w-85 h-85 sm:w-115 sm:h-115 bg-[#C8A458]/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Double Rotating Rings + Floating Logo */}
        <div className="relative flex items-center justify-center mb-12">
          <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-dashed border-[#C8A458]/40 animate-slow-spin pointer-events-none" />
          <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-[#C8A458]/30 animate-reverse-spin pointer-events-none" />

          <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-[0_0_50px_rgba(200,164,88,0.25)] animate-float border-2 border-[#C8A458]/70 bg-[#3E3C32]">
            <Image
              src="/logo.png.jpeg"
              alt="Henly Studio Logo"
              fill
              sizes="224px"
              className="object-cover scale-105"
              priority
            />
          </div>
        </div>

        {/* Positioned Kicker with Generous Spacing */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-up">
          <span className="h-px w-8 sm:w-14 bg-[#C8A458]/60" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#C8A458] font-semibold">
            Artisanal Organic Henna • Pakistan
          </span>
          <span className="h-px w-8 sm:w-14 bg-[#C8A458]/60" />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-wide text-[#F5F3EE] mb-5 animate-fade-up">
          Henly Studio<span className="text-[#C8A458]">.pk</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#D6D1C4] max-w-md leading-relaxed mb-9 animate-fade-up">
          Crafting timeless bridal memories & freshly mixed organic henna cones for a deep, unforgettable mahogany stain.
        </p>

        {/* 3 Luxury Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-up">
          <span className="px-4 py-1.5 rounded-full bg-[#F5F3EE]/5 border border-[#C8A458]/30 text-[11px] text-[#E5DEC9] backdrop-blur-sm">
            ✦ Bridal & Nikah Art
          </span>
          <span className="px-4 py-1.5 rounded-full bg-[#F5F3EE]/5 border border-[#C8A458]/30 text-[11px] text-[#E5DEC9] backdrop-blur-sm">
            ✦ All Events Booking
          </span>
          <span className="px-4 py-1.5 rounded-full bg-[#F5F3EE]/5 border border-[#C8A458]/30 text-[11px] text-[#E5DEC9] backdrop-blur-sm">
            ✦ Fresh Organic Cones
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-up">
          <Link
            href="/studio"
            className="group relative overflow-hidden w-full sm:w-auto px-9 py-3.5 rounded-full bg-linear-to-r from-[#C8A458] via-[#DFC07A] to-[#C8A458] text-[#26251E] font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(200,164,88,0.5)] hover:scale-105 transition-all duration-300"
          >
            Enter Studio →
          </Link>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#C8A458]/50 text-[#F5F3EE] text-sm font-medium hover:bg-[#C8A458]/15 hover:border-[#C8A458] transition-all duration-300"
          >
            Follow @henly_studio.pk
          </a>
        </div>
      </div>
    </main>
  );
}
