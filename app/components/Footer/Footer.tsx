"use client";
import React, { useEffect, useRef } from "react";
import "@/public/styles/Footer.css";
import { footerItems, footerLegalItems, footerSocialItems } from "@/app/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Load GSAP only
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;

    document.body.appendChild(script);
    
    script.onload = () => {
      const gsap = (window as any).gsap;
      
      if (!gsap) return;

      // Simple animation when component mounts
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
        );
      }

      // Animate sections with stagger
      const validSections = sectionsRef.current.filter(Boolean);
      if (validSections.length > 0) {
        gsap.fromTo(
          validSections,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.15,
            duration: 0.8, 
            ease: "power3.out",
            delay: 0.3
          }
        );
      }
    };

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-inner">
        {/* Logo + small description */}
        <div ref={logoRef} className="footer-logo-block">
          <a href="/" className="footer-logo-link text-3xl">
            {/* <img src="/logo.png" alt="Campus Buzz" className="footer-logo" /> */}
            Campus Buzz
          </a>
          <p className="footer-description">
            Crafting modern digital experiences for the web.
          </p>
        </div>

        {/* Navigation sections */}
        <nav className="footer-sections" aria-label="Footer navigation">
          {/* Company Section */}
          <div ref={el => sectionsRef.current[0] = el} className="footer-section">
            <h4>Company</h4>
            <ul>
              {footerItems.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div ref={el => sectionsRef.current[1] = el} className="footer-section">
            <h4>Legal</h4>
            <ul>
              {footerLegalItems.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div ref={el => sectionsRef.current[2] = el} className="footer-section">
            <h4>Follow Us</h4>
            <ul>
              {footerSocialItems.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {year} Company. All rights reserved.</p>
      </div>
    </footer>
  );
}