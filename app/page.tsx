import Image from "next/image";
import logo from "../public/logo-no-bg.png";

export default function Home() {
  return (
    <>
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-6">
          {/* Logo and Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image src={logo} alt="iCare++ Logo" className="h-32 w-auto"></Image>
            </div>
            <h1 className="text-[#1B6B7B] mb-3 text-3xl">Sign In</h1>
            <p className="text-gray-600">Please enter your email and password</p>
          </div>

          {/* Login Form */}
          <form action="" className="space-y-6">
            <div className="">
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B7B] focus:border-transparent transition-all bg-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B7B] focus:border-transparent transition-all bg-white"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#1B6B7B] border-gray-300 rounded focus:ring-[#1B6B7B]"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#1B6B7B] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B6B7B] text-white py-3 rounded-lg hover:bg-[#155663] transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-[#1B6B7B] hover:underline">
                Contact Administrator
              </a>
            </p>
          </div>

          {/* Additional Info */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © 2026 iCARE++
          </p>
        </div>
      </div>
    </>
  );
}
