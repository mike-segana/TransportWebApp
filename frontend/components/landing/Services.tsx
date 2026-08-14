"use client";

import { useState } from "react";

const services = [
  {
    number: "01",
    title: "Local transport",
    eyebrow: "LOCAL",
    description:
      "Flexible collection and delivery for journeys close to home. Simple transport when you need it.",
    image:
      "https://images.pexels.com/photos/6407433/pexels-photo-6407433.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    number: "02",
    title: "Long-distance delivery",
    eyebrow: "UK WIDE",
    description:
      "Reliable transport for longer journeys, connecting collections and deliveries across the country.",
    image:
      "https://images.pexels.com/photos/6169129/pexels-photo-6169129.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    number: "03",
    title: "Same-day transport",
    eyebrow: "PRIORITY",
    description:
      "When something needs to move today, arrange priority transport built around the urgency of your journey.",
    image:
      "https://images.pexels.com/photos/6169135/pexels-photo-6169135.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    number: "04",
    title: "Business transport",
    eyebrow: "BUSINESS",
    description:
      "Additional transport capacity for businesses, from individual deliveries to regular logistics requirements.",
    image:
      "https://images.pexels.com/photos/6169178/pexels-photo-6169178.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
];

export default function Services() {
  const [active, setActive] = useState(0);

  const current = services[active];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#F5F3EE] px-6 py-24 text-[#171A1F] sm:px-8 lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#315CFF]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#315CFF]">
                Our services
              </span>
            </div>

            <h2 className="max-w-5xl text-5xl font-semibold leading-[0.91] tracking-[-0.065em] sm:text-6xl lg:text-[6.5rem]">
              Transport built
              <br />
              <span className="text-[#171A1F]/25">
                around the journey.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-[#62666D] lg:ml-auto lg:pb-2">
            Different journeys need different solutions. Choose the service
            that fits what you're moving, where it's going and when it needs
            to arrive.
          </p>
        </div>

        {/* SERVICES */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">

          {/* SERVICE LIST */}
          <div className="border-t border-[#171A1F]/10">
            {services.map((service, index) => {
              const isActive = index === active;

              return (
                <button
                  key={service.number}
                  type="button"
                  onClick={() => setActive(index)}
                  className="group relative flex w-full items-start gap-5 border-b border-[#171A1F]/10 py-7 text-left sm:py-8"
                >
                  {/* ACTIVE LINE */}
                  <span
                    className={`absolute left-0 top-0 h-full w-[2px] origin-top transition-transform duration-500 ${
                      isActive
                        ? "scale-y-100 bg-[#315CFF]"
                        : "scale-y-0 bg-[#315CFF]"
                    }`}
                  />

                  {/* NUMBER */}
                  <span
                    className={`pt-1 text-[10px] font-bold tracking-[0.18em] transition ${
                      isActive
                        ? "text-[#315CFF]"
                        : "text-[#171A1F]/25 group-hover:text-[#171A1F]/50"
                    }`}
                  >
                    {service.number}
                  </span>

                  <div className="flex-1">

                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-5">
                      <h3
                        className={`text-2xl font-medium tracking-[-0.035em] transition sm:text-3xl ${
                          isActive
                            ? "translate-x-1 text-[#171A1F]"
                            : "text-[#171A1F]/45 group-hover:text-[#171A1F]/75"
                        }`}
                      >
                        {service.title}
                      </h3>

                      {/* ARROW */}
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                          isActive
                            ? "border-[#315CFF] bg-[#315CFF] text-white"
                            : "border-[#171A1F]/10 text-[#171A1F]/25 group-hover:border-[#171A1F]/25 group-hover:text-[#171A1F]/60"
                        }`}
                      >
                        <span
                          className={`transition-transform duration-300 ${
                            isActive
                              ? "translate-x-0.5"
                              : "group-hover:translate-x-0.5"
                          }`}
                        >
                          →
                        </span>
                      </span>
                    </div>

                    {/* DESCRIPTION */}
                    <div
                      className={`grid transition-all duration-500 ${
                        isActive
                          ? "mt-4 grid-rows-[1fr] opacity-100"
                          : "mt-0 grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-md text-sm leading-6 text-[#62666D]">
                          {service.description}
                        </p>

                        <span className="mt-4 inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-[#315CFF]">
                          {service.eyebrow}
                        </span>
                      </div>
                    </div>

                  </div>
                </button>
              );
            })}
          </div>

          {/* IMAGE PANEL */}
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#DDD9D0] sm:min-h-[620px]">

            {/* SERVICE IMAGES */}
            {services.map((service, index) => (
              <img
                key={service.number}
                src={service.image}
                alt={service.title}
                loading={index === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                  index === active
                    ? "scale-100 opacity-100"
                    : "scale-105 opacity-0"
                }`}
              />
            ))}

            {/* DARK CINEMATIC GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            {/* SOFT VIGNETTE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.18)_100%)]" />

            {/* TOP META */}
            <div className="absolute left-6 right-6 top-6 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">

              <span className="rounded-full border border-white/20 bg-black/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                {current.eyebrow}
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                {current.number} / 04
              </span>

            </div>

            {/* BOTTOM CONTENT */}
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9 lg:p-10">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                TransitFlow
              </p>

              <h3 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                {current.title}
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
                {current.description}
              </p>

              <a
                href="#quote"
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#171A1F] transition duration-300 hover:bg-[#315CFF] hover:text-white"
              >
                Start a request

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

            </div>
          </div>
        </div>

        {/* BOTTOM STATEMENT */}
        <div className="mt-20 border-t border-[#171A1F]/10 pt-8 sm:mt-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#171A1F]/35">
                Built around your journey
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#62666D]">
                From a single collection to a larger delivery, choose the
                transport that makes sense for the job.
              </p>
            </div>

            <a
              href="#quote"
              className="group flex shrink-0 items-center gap-3 text-sm font-semibold"
            >
              Get started

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#171A1F]/15 transition duration-300 group-hover:border-[#315CFF] group-hover:bg-[#315CFF] group-hover:text-white">
                →
              </span>
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}