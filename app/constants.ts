import { IconType } from "react-icons";
import { FiUser } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import { BsLaptopFill } from "react-icons/bs";
import { FaTools, FaHistory } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdSpaceDashboard } from "react-icons/md";
import { Brain, Target, Users, Zap, Shield, CheckCircle, LucideIcon } from "lucide-react";

type NavbarItem = {
    label: string;
    href: string;
    icon: IconType;
    subItems?: NavbarItem[];
}

type FooterItem = {
    label: string;
    href: string;
}

const accountItems: NavbarItem[] = [
  { label: "Profile", href: "/profile", icon: FiUser },
  { label: "Settings", href: "/settings", icon: IoSettingsOutline },
];

// Navbar items
const navbarItems: NavbarItem[] = [
  { label: 'Home', href: '/', icon: FiUser },
  { label: 'Dashboard', href: '/dashboard', icon: FiUser },
  { 
    label: 'Account', 
    href: '#',
    subItems: accountItems,
    icon: FaArrowUp
  },
];

// Footer items
const footerItems: FooterItem[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers'},
  { label: 'Contact Us', href: '/contact'},
];

const footerLegalItems: FooterItem[] = [
  { label: 'Privacy Policy', href: '/privacy'},
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact Us', href: '/contact' },
];

const footerSocialItems: FooterItem[] = [
  { label: 'Twitter', href: 'https://twitter.com/mycompany' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/mycompany' },
  { label: 'Instagram', href: 'https://instagram.com/mycompany'},
];


export {
  navbarItems,
  accountItems,
  footerItems,
  footerLegalItems,
  footerSocialItems
};

export type { NavbarItem, FooterItem};