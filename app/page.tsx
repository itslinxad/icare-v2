import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo-no-bg.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6">
      <div className="text-center space-y-6 max-w-lg">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src={logo} alt="iCare++ Logo" className="h-28 w-auto" />
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-[#1B6B7B]">Welcome to iCARE++</h1>
          <p className="text-lg text-gray-600">
            Your complete healthcare management solution
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed">
          Streamline patient care, manage records, and enhance healthcare delivery 
          with our comprehensive platform designed for modern medical practices.
        </p>

        {/* Sign In Button */}
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-[#1B6B7B] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#155663] focus:outline-none focus:ring-2 focus:ring-[#1B6B7B] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#1B6B7B]/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v-4a4 4 0 00-4-4H6a4 4 0 00-4 4v4" />
          </svg>
          Sign In
        </Link>

        {/* Copyright */}
        <p className="text-xs text-gray-400 pt-6">
          &copy; 2026 iCARE++. All rights reserved.
        </p>
      </div>
    </div>
  );
}