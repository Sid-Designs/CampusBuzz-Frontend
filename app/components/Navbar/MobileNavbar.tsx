import React from "react";
import { navbarItems } from "@/app/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";

const MobileNavbar = () => {
  const pathname = usePathname();
  return (
    <>
      {navbarItems.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className={`nav-link mobLink w-full h-full center py-2${
            pathname === item.href ? "active" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default MobileNavbar;
