"use client";

import React, { useState, useRef } from "react";
import { navbarItems } from "@/app/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "@/public/styles/Navbar.css";
import { gsap, useGSAP } from "@/app/lib/gsap";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;

      gsap.to(".navBar", {
        top: isScrolled ? "-10px" : "0px",
        opacity: isScrolled ? 0.95 : 1,
        duration: isScrolled ? 0.2 : 0.3,
        ease: "power3.inOut",
        boxShadow: isScrolled
          ? "0 2px 8px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08),"
          : "0 2px 8px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
      });
    };

    gsap.from(".navBar", {
      top: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useGSAP(() => {
    if (mobileMenuRef.current && isMobileMenuOpen) {
      const links = linkRefs.current.filter(Boolean);

      gsap.to(mobileMenuRef.current, {
        opacity: 1,
        visibility: "visible",
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      });

      gsap.to(links, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.08,
        ease: "back.out(1.7)",
      });
    } else if (mobileMenuRef.current && !isMobileMenuOpen) {
      const links = linkRefs.current.filter(Boolean);

      gsap.to(links, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        stagger: 0.05,
        ease: "power3.in",
      });

      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        visibility: "hidden",
        y: -10,
        duration: 0.3,
        ease: "power3.in",
        delay: 0.1,
      });
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  return (
    <nav className="w-full">
      <div className="navBar flex items-center justify-between px-4 md:px-8">
        <div className="text-xl font-bold text-gray-800">Campus Buzz</div>
        <div className="desktop-menu">
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
        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="hamburger-line line-top"></span>
          <span className="hamburger-line line-middle"></span>
          <span className="hamburger-line line-bottom"></span>
        </button>
      </div>
      <div ref={mobileMenuRef} className="mobNavbar">
        <div className="w-full flex flex-col gap-2">
          {navbarItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              ref={(el) => (linkRefs.current[idx] = el)}
              className={`mobLink ${
                pathname === item.href ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
