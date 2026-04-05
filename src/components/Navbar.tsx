import { Link } from "react-router-dom";
import { Dog, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "분양중인 아이들", href: "/puppies" },
    { name: "분양 후기", href: "/reviews" },
    { name: "분양 절차", href: "/process" },
    { name: "오시는 길", href: "/location" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-amber-100 p-2 rounded-xl group-hover:bg-amber-200 transition-colors">
              <Dog className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">함께있어줄개</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-full hover:bg-amber-700 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              관리자
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-4 text-base font-semibold text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
          >
            관리자 로그인
          </Link>
        </div>
      </div>
    </nav>
  );
}
