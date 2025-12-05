"use client";
import React, { useEffect, useRef } from "react";
import "@/public/styles/Footer.css";
import { footerItems, footerLegalItems, footerSocialItems } from "@/app/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Load GSAP
    const script1 = document.createElement("script");
    script1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
    script2.async = true;

    document.body.appendChild(script1);
    
    script1.onload = () => {
      document.body.appendChild(script2);
      
      script2.onload = () => {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        // Animate logo block
        if (logoRef.current) {
          gsap.from(logoRef.current, {
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
          });
        }

        // Animate sections with stagger
        if (sectionsRef.current.length > 0) {
          gsap.from(sectionsRef.current, {
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
          });
        }
      };
    };

    return () => {
      if (document.body.contains(script1)) document.body.removeChild(script1);
      if (document.body.contains(script2)) document.body.removeChild(script2);
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