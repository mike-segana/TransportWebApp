"use client";

import { useMemo, useState } from "react";

type VehicleType = "small" | "medium" | "large" | "luton";

const vehicleRates: Record<VehicleType, number> = {
  small: 1.5,
  medium: 1.8,
  large: 2.0,
  luton: 2.5,
};

const vehicleLabels: Record<VehicleType, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  luton: "Luton",
};

const vehicleDescriptions: Record<VehicleType, string> = {
  small: "Ideal for lighter loads and smaller collections.",
  medium: "A flexible choice for everyday transport.",
  large: "More capacity for larger or multiple items.",
  luton: "Maximum space for substantial loads.",
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function startOfCalendar(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const day = first.getDay();

  // Monday = 0 ... Sunday = 6
  const mondayOffset = day === 0 ? 6 : day - 1;

  return new Date(
    first.getFullYear(),
    first.getMonth(),
    1 - mondayOffset
  );
}

export default function QuoteEstimator() {
  const today = new Date();

  const [vehicle, setVehicle] = useState<VehicleType>("medium");
  const [miles, setMiles] = useState("");
  const [helpers, setHelpers] = useState(0);
  const [sameDay, setSameDay] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const selectedIsWeekend = selectedDate
    ? isWeekend(selectedDate)
    : false;

  const multiplier = sameDay ? 1.5 : selectedIsWeekend ? 1.25 : 1;

  const pricingLabel = sameDay
    ? "Same-day"
    : selectedIsWeekend
      ? "Weekend"
      : "Standard";

  const estimate = useMemo(() => {
    const distance = Number(miles);

    if (!distance || distance <= 0) return null;

    const base = distance * vehicleRates[vehicle];

    /*
      Helper pricing is intentionally not included yet.
      This can later come from your backend pricing configuration.
    */
    const helperCost = 0;

    return (base + helperCost) * multiplier;
  }, [miles, vehicle, multiplier]);

  const calendarDays = useMemo(() => {
    const start = startOfCalendar(calendarMonth);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [calendarMonth]);

  function previousMonth() {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + 1, 1)
    );
  }

  function selectDate(date: Date) {
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      return;
    }

    setSelectedDate(date);
    setCalendarOpen(false);
  }

  return (
    <section
      id="quote"
      className="relative overflow-hidden bg-[#F7F8FA] px-6 py-24 text-[#111827] sm:px-8 lg:px-10 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[#DCEBFF] blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-0 h-[35rem] w-[35rem] rounded-full bg-[#E7F0F8] blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* LEFT */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#155EEF]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#155EEF]">
                Plan your journey
              </span>
            </div>

            <h2 className="max-w-xl text-5xl font-semibold leading-[0.93] tracking-[-0.055em] sm:text-6xl lg:text-[5.25rem]">
              Tell us where
              <br />
              <span className="text-[#155EEF]">you&apos;re going.</span>
            </h2>

            <p className="mt-8 max-w-lg text-base leading-7 text-[#475467] sm:text-lg">
              Whether you&apos;re moving a few items across town or coordinating a
              larger delivery across the country, TransitFlow helps you plan
              the right transport for the journey.
            </p>

            <div className="relative mt-10 max-w-lg overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#DCEBFF] blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/35">
                    Your journey
                  </span>

                  <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#155EEF]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#155EEF]" />
                    Flexible
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4FA]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#155EEF]" />
                  </div>

                  <div className="relative h-px flex-1 bg-black/10">
                    <div className="absolute left-[30%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#155EEF]/40" />
                    <div className="absolute left-[62%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#155EEF]/40" />
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827]">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-xs font-semibold text-[#344054]">
                    Pickup
                  </span>

                  <span className="text-xs font-semibold text-[#344054]">
                    Delivery
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FA] text-sm">
                  🚚
                </span>

                <h3 className="mt-4 text-sm font-semibold">
                  Choose your vehicle
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#667085]">
                  From compact vans through to Luton capacity, choose the
                  vehicle that fits your load.
                </p>
              </div>

              <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FA] text-sm">
                  📅
                </span>

                <h3 className="mt-4 text-sm font-semibold">
                  Choose your date
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#667085]">
                  Weekends and same-day journeys can be priced differently.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-white/70 blur-xl" />

            <div className="relative overflow-visible rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_35px_100px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10">
              <div className="mb-8 flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#155EEF]">
                    Journey details
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    Get an estimate
                  </h3>
                </div>

                <div className="hidden rounded-full bg-[#EEF4FA] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#155EEF] sm:block">
                  Indicative
                </div>
              </div>

              {/* Locations */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickup"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40"
                  >
                    Pickup
                  </label>

                  <input
                    id="pickup"
                    placeholder="Collection location"
                    className="w-full rounded-2xl border border-black/10 bg-[#F8F9FB] px-4 py-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#155EEF]/40 focus:bg-white focus:ring-4 focus:ring-[#155EEF]/5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dropoff"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40"
                  >
                    Drop-off
                  </label>

                  <input
                    id="dropoff"
                    placeholder="Delivery location"
                    className="w-full rounded-2xl border border-black/10 bg-[#F8F9FB] px-4 py-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#155EEF]/40 focus:bg-white focus:ring-4 focus:ring-[#155EEF]/5"
                  />
                </div>
              </div>

              {/* DATE */}
              <div className="relative mt-6">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                  Delivery date
                </label>

                <button
                  type="button"
                  onClick={() => setCalendarOpen((open) => !open)}
                  className="flex w-full items-center justify-between rounded-2xl border border-black/10 bg-[#F8F9FB] px-4 py-4 text-left transition hover:border-black/20 focus:border-[#155EEF]/40 focus:bg-white"
                >
                  <div>
                    <span className="block text-sm font-medium">
                      {selectedDate
                        ? formatDate(selectedDate)
                        : "Choose a delivery date"}
                    </span>

                    {selectedDate && (
                      <span className="mt-1 block text-[10px] text-[#667085]">
                        {sameDay
                          ? "Same-day pricing"
                          : selectedIsWeekend
                            ? "Weekend pricing"
                            : "Standard pricing"}
                      </span>
                    )}
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm shadow-sm">
                    📅
                  </span>
                </button>

                {calendarOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_25px_80px_rgba(15,23,42,.16)]">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={previousMonth}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition hover:bg-[#F8F9FB]"
                      >
                        ←
                      </button>

                      <div className="text-center">
                        <p className="text-sm font-semibold">
                          {monthNames[calendarMonth.getMonth()]}
                        </p>

                        <p className="text-[10px] text-black/35">
                          {calendarMonth.getFullYear()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={nextMonth}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition hover:bg-[#F8F9FB]"
                      >
                        →
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-7 gap-1">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                        (day) => (
                          <div
                            key={day}
                            className="py-2 text-center text-[9px] font-bold uppercase tracking-wider text-black/30"
                          >
                            {day}
                          </div>
                        )
                      )}

                      {calendarDays.map((date) => {
                        const currentMonth =
                          date.getMonth() === calendarMonth.getMonth();

                        const todayDate = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate()
                        );

                        const disabled = date < todayDate;

                        const selected =
                          selectedDate && isSameDate(date, selectedDate);

                        const weekend = isWeekend(date);

                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            disabled={disabled}
                            onClick={() => selectDate(date)}
                            className={`relative aspect-square rounded-xl text-xs transition ${
                              !currentMonth
                                ? "text-black/15"
                                : disabled
                                  ? "cursor-not-allowed text-black/15"
                                  : selected
                                    ? "bg-[#155EEF] font-semibold text-white shadow-[0_6px_15px_rgba(21,94,239,.2)]"
                                    : weekend
                                      ? "bg-[#FFF8F0] text-[#9A5B16] hover:bg-[#FFF1DE]"
                                      : "text-[#344054] hover:bg-[#EEF4FA]"
                            }`}
                          >
                            {date.getDate()}

                            {weekend && currentMonth && !selected && !disabled && (
                              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#F59E0B]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex gap-4 border-t border-black/[0.07] pt-4 text-[9px] text-black/40">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                        Weekend
                      </span>

                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#155EEF]" />
                        Selected
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Distance */}
              <div className="mt-6">
                <label
                  htmlFor="miles"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40"
                >
                  Estimated distance
                </label>

                <div className="relative">
                  <input
                    id="miles"
                    type="number"
                    min="0"
                    value={miles}
                    onChange={(event) => setMiles(event.target.value)}
                    placeholder="Enter distance"
                    className="w-full rounded-2xl border border-black/10 bg-[#F8F9FB] px-4 py-4 pr-16 text-sm outline-none transition placeholder:text-black/25 focus:border-[#155EEF]/40 focus:bg-white focus:ring-4 focus:ring-[#155EEF]/5"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-black/35">
                    miles
                  </span>
                </div>
              </div>

              {/* Vehicle */}
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                    Vehicle
                  </label>

                  <span className="text-[10px] text-black/35">
                    Indicative rate
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {(Object.keys(vehicleRates) as VehicleType[]).map(
                    (type) => {
                      const active = vehicle === type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setVehicle(type)}
                          className={`rounded-2xl border p-4 text-left transition duration-200 ${
                            active
                              ? "border-[#155EEF] bg-[#155EEF] text-white shadow-[0_10px_25px_rgba(21,94,239,.18)]"
                              : "border-black/10 bg-[#F8F9FB] hover:border-black/20 hover:bg-white"
                          }`}
                        >
                          <span className="block text-sm font-semibold">
                            {vehicleLabels[type]}
                          </span>

                          <span
                            className={`mt-1 block text-[10px] ${
                              active ? "text-white/60" : "text-black/35"
                            }`}
                          >
                            £{vehicleRates[type].toFixed(2)} / mi
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="mt-3 text-xs leading-5 text-[#667085]">
                  {vehicleDescriptions[vehicle]}
                </p>
              </div>

              {/* Options */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-[#F8F9FB] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                    Helpers
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {helpers} {helpers === 1 ? "helper" : "helpers"}
                    </span>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setHelpers((value) => Math.max(0, value - 1))
                        }
                        className="h-8 w-8 rounded-full border border-black/10 bg-white text-sm transition hover:border-black/20 hover:bg-black hover:text-white"
                      >
                        −
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setHelpers((value) => Math.min(4, value + 1))
                        }
                        className="h-8 w-8 rounded-full border border-black/10 bg-white text-sm transition hover:border-black/20 hover:bg-black hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSameDay((value) => !value)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    sameDay
                      ? "border-[#155EEF] bg-[#155EEF] text-white"
                      : "border-black/10 bg-[#F8F9FB] hover:bg-white"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                      sameDay ? "text-white/55" : "text-black/40"
                    }`}
                  >
                    Priority
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium">Same-day</span>

                    <span
                      className={`h-5 w-9 rounded-full p-1 transition ${
                        sameDay ? "bg-white" : "bg-black/10"
                      }`}
                    >
                      <span
                        className={`block h-3 w-3 rounded-full transition ${
                          sameDay
                            ? "translate-x-4 bg-[#155EEF]"
                            : "bg-black/30"
                        }`}
                      />
                    </span>
                  </div>
                </button>
              </div>

              {/* Pricing explanation */}
              {selectedDate && (
                <div className="mt-6 rounded-2xl border border-black/[0.07] bg-[#F8F9FB] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
                      Pricing
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#155EEF] shadow-sm">
                      {pricingLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#667085]">
                        {sameDay
                          ? "Same-day adjustment"
                          : selectedIsWeekend
                            ? "Weekend adjustment"
                            : "Standard rate"}
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {multiplier.toFixed(2)}×
                      </p>
                    </div>

                    <p className="text-xs text-[#667085]">
                      {sameDay
                        ? "+50%"
                        : selectedIsWeekend
                          ? "+25%"
                          : "No adjustment"}
                    </p>
                  </div>
                </div>
              )}

              {/* Estimate */}
              <div className="mt-7 overflow-hidden rounded-[1.5rem] bg-[#111827] p-6 text-white sm:p-7">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Indicative journey estimate
                    </p>

                    <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                      {estimate === null ? "—" : `£${estimate.toFixed(2)}`}
                    </p>
                  </div>

                  {selectedDate && (
                    <span className="text-right text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      {pricingLabel}
                      <br />
                      {multiplier.toFixed(2)}×
                    </span>
                  )}
                </div>

                <p className="mt-3 max-w-md text-xs leading-5 text-white/35">
                  Indicative only. Final pricing will be confirmed when your
                  transport request is submitted.
                </p>
              </div>

              <button
                type="button"
                className="group mt-4 flex w-full items-center justify-between rounded-2xl bg-[#155EEF] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(21,94,239,.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0F4FCC]"
              >
                Continue with request

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}