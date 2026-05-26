import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function DoctorNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 md:px-8 md:py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label="Doctor dashboard"
        >
          <span className="block w-[132px] sm:w-[160px] md:w-[180px] [&_img]:h-auto [&_img]:w-full">
            <Logo />
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <div className="hidden min-w-0 text-right min-[380px]:block">
            <span className="block max-w-[150px] truncate text-xs font-semibold text-gray-700 sm:max-w-none sm:text-sm">
              Dr. Runa Pradhan NP
            </span>
            <span className="hidden text-[11px] text-gray-400 sm:block">
              Doctor
            </span>
          </div>

          <button
            type="button"
            className="flex min-w-0 items-center gap-1 rounded-xl px-1.5 py-1 transition-colors hover:bg-gray-50 sm:px-2"
            aria-label="Open doctor profile menu"
          >
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 sm:h-10 sm:w-10">
              <Image
                src="/doctor/profile-doc.png"
                alt="Profile"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500" />
          </button>
        </div>
      </div>
    </nav>
  );
}
