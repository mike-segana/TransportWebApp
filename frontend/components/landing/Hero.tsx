import Link from "next/link";

function RoutePath() {
  return (
    <svg
      viewBox="0 0 1000 430"
      className="absolute inset-0 h-full w-full"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#155EEF" stopOpacity="0" />
          <stop offset="30%" stopColor="#155EEF" stopOpacity=".5" />
          <stop offset="65%" stopColor="#155EEF" stopOpacity=".9" />
          <stop offset="100%" stopColor="#155EEF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M30 350 C190 350 175 80 365 135 S550 390 690 220 S820 60 970 105"
        stroke="rgba(255,255,255,.75)"
        strokeWidth="2"
        strokeDasharray="8 12"
        className="route-animation"
      />

      <path
        d="M30 350 C190 350 175 80 365 135 S550 390 690 220 S820 60 970 105"
        stroke="url(#routeGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="0 1200"
        className="route-progress"
      />
    </svg>
  );
}

function Location({
  city,
  detail,
  className,
}: {
  city: string;
  detail: string;
  className: string;
}) {
  return (
    <div className={`absolute hidden md:block ${className}`}>
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inset-0 rounded-full bg-[#155EEF]/30 location-ring" />
          <span className="relative h-3 w-3 rounded-full border-2 border-white bg-[#155EEF] shadow-[0_0_20px_rgba(21,94,239,.7)]" />
        </span>

        <div className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 shadow-xl backdrop-blur-md">
          <p className="text-[11px] font-bold tracking-wide text-[#111827]">
            {city}
          </p>

          <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-[#667085]">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#EEF4FA] text-[#111827]">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(91,168,255,.24),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(255,255,255,.95),transparent_35%)]" />

      {/* Decorative grid */}
      <div className="transport-grid absolute inset-0 opacity-40" />

      {/* Large blue atmospheric shape */}
      <div
        aria-hidden="true"
        className="absolute -right-[15%] top-[12%] h-[42rem] w-[42rem] rounded-full bg-[#8EC5FF]/25 blur-[100px]"
      />

      {/* Main visual */}
      <div className="absolute inset-x-0 bottom-0 top-[14%]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#EEF4FA]" />

        {/* Replace this block with a real hero image/video later */}
        <div className="absolute bottom-[-12%] right-[-8%] h-[75%] w-[75%] rotate-[-3deg] rounded-[4rem] bg-gradient-to-br from-[#D8E9F8] via-[#BBD9F2] to-[#91B9D9] shadow-[-30px_30px_100px_rgba(30,80,120,.18)]" />

        <div className="absolute bottom-[2%] right-[3%] h-[65%] w-[65%] overflow-hidden rounded-[3.5rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,.8),transparent_30%),linear-gradient(135deg,#DCEEFF,#9DC4E4)]" />

          {/* Stylised road */}
          <div className="absolute bottom-[-20%] left-[10%] h-[65%] w-[120%] -rotate-[15deg] rounded-[50%] bg-[#738DA3]/30 blur-[1px]" />

          <div className="absolute bottom-[22%] left-[8%] h-1 w-[70%] -rotate-[15deg] bg-white/70" />

          {/* Vehicle silhouette */}
          <div className="absolute bottom-[28%] left-[42%] h-16 w-36 -rotate-[15deg] rounded-[18px] bg-white shadow-[20px_20px_40px_rgba(20,50,80,.18)] sm:h-20 sm:w-48">
            <div className="absolute left-5 top-3 h-8 w-20 rounded-lg bg-[#B6D2E8] sm:h-10 sm:w-28" />

            <div className="absolute -bottom-2 left-5 h-7 w-7 rounded-full bg-[#263746] ring-4 ring-white sm:left-7 sm:h-9 sm:w-9" />
            <div className="absolute -bottom-2 right-5 h-7 w-7 rounded-full bg-[#263746] ring-4 ring-white sm:right-7 sm:h-9 sm:w-9" />

            <div className="absolute right-2 top-4 h-3 w-3 rounded-full bg-[#155EEF] shadow-[0_0_20px_rgba(21,94,239,.7)]" />
          </div>
        </div>
      </div>

      {/* Network overlay */}
      <div className="absolute bottom-[9%] left-0 right-0 hidden h-[35%] lg:block">
        <RoutePath />

        <Location
          city="London"
          detail="Pickup"
          className="bottom-[10%] left-[8%]"
        />

        <Location
          city="Birmingham"
          detail="Transit"
          className="bottom-[55%] left-[33%]"
        />

        <Location
          city="Manchester"
          detail="Delivery"
          className="right-[17%] top-[8%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center px-6 pb-32 pt-32 sm:px-8 lg:px-12">
        <div className="max-w-4xl">
          <div className="hero-fade mb-7 flex items-center gap-3">
            <span className="flex h-7 items-center rounded-full border border-[#155EEF]/15 bg-white/60 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#155EEF] shadow-sm backdrop-blur">
              UK transport network
            </span>

            <span className="hidden text-xs text-[#667085] sm:block">
              Built around your journey
            </span>
          </div>

          <h1 className="hero-fade hero-delay-1 max-w-4xl text-[clamp(3.8rem,8.5vw,8.8rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
            Transport,
            <br />
            <span className="text-[#155EEF]">in motion.</span>
          </h1>

          <p className="hero-fade hero-delay-2 mt-8 max-w-xl text-base leading-7 text-[#475467] sm:text-lg">
            Flexible vehicle transport designed around the journey — from
            pickup to delivery, without the unnecessary friction.
          </p>

          <div className="hero-fade hero-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#155EEF] px-7 py-4 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(21,94,239,.25)] transition duration-300 hover:-translate-y-1 hover:bg-[#0F4FCC] hover:shadow-[0_20px_45px_rgba(21,94,239,.3)]"
            >
              Request transport

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/60 px-7 py-4 text-sm font-semibold text-[#344054] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Explore services
              <span>↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom information strip */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-black/[0.06] bg-white/60 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-black/[0.07] px-6 sm:grid-cols-4 sm:px-8 lg:px-12">
          {[
            ["Flexible fleet", "Small to Luton"],
            ["Same-day", "When you need it"],
            ["UK coverage", "Built for distance"],
            ["Digital journey", "One place to manage"],
          ].map(([title, subtitle]) => (
            <div
              key={title}
              className="px-4 py-5 first:pl-0 sm:px-6 sm:py-6 lg:px-8"
            >
              <p className="text-xs font-bold text-[#111827]">{title}</p>
              <p className="mt-1 text-[10px] text-[#667085]">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}