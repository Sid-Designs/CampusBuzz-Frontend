"use client";
import React, { useRef } from "react";
import "@/public/styles/Footer.css";
import { footerItems, footerLegalItems, footerSocialItems } from "@/app/constants";
export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-inner">
        {/* Logo + small description */}
        <div className="footer-logo-block fade-up">
          <a href="/" className="footer-logo-link text-3xl">
            Campus Buzz
          </a>
          <p className="footer-description">
            Crafting modern digital experiences for the web.
          </p>
        </div>

        {/* Navigation sections */}
        <nav className="footer-sections" aria-label="Footer navigation">
          {/* Company Section */}
          <div className="footer-section fade-up" style={{ animationDelay: "0.1s" }}>
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
          <div className="footer-section fade-up" style={{ animationDelay: "0.2s" }}>
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
          <div className="footer-section fade-up" style={{ animationDelay: "0.3s" }}>
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