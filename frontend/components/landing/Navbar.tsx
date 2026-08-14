"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Fleet", href: "#fleet" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Coverage", href: "#coverage" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-black/[0.08] bg-white/75 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#155EEF] text-sm font-black text-white shadow-[0_6px_20px_rgba(21,94,239,0.25)]">
            T
          </span>

          <span className="text-sm font-bold tracking-[0.16em] text-[#111827]">
            TRANSITFLOW
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#667085] transition-colors hover:text-[#111827]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#344054] transition hover:bg-black/[0.04]"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-full bg-[#155EEF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(21,94,239,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0F4FCC]"
          >
            Get started
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white sm:hidden"
        >
          <span className="space-y-1.5">
            <span className="block h-px w-5 bg-[#111827]" />
            <span className="block h-px w-5 bg-[#111827]" />
            <span className="block h-px w-3 bg-[#111827]" />
          </span>
        </button>
      </nav>

      {open && (
        <div className="mx-2 mt-2 rounded-[1.75rem] border border-black/[0.08] bg-white/95 p-4 shadow-2xl backdrop-blur-xl sm:hidden">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 text-sm font-medium text-[#475467] transition hover:bg-black/[0.03]"
              >
                {item.label}
              </a>
            ))}

            <div className="my-2 h-px bg-black/[0.07]" />

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#344054]"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-2xl bg-[#155EEF] px-4 py-3.5 text-center text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}