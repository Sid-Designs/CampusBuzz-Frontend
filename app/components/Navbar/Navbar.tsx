"use client";

import React, { useState, useEffect, useRef } from "react";
import { navbarItems } from "@/app/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "@/public/styles/Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full sticky top-0 z-50">
      <div className={`navBar flex items-center justify-between px-4 md:px-8 ${isScrolled ? "scrolled" : ""}`}>
        <div className="text-xl font-bold text-gray-800">Campus Buzz</div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navbarItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col w-8 h-8 justify-center items-center gap-1.5"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`w-6 h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-gray-800 transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="text-xl font-bold text-gray-800">Menu</div>
            <button
              onClick={closeMobileMenu}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {navbarItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`py-3 px-4 rounded-lg text-lg ${
                  pathname === item.href 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
};
export default Navbar;