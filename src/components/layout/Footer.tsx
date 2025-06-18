import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Browse Courses", href: "/courses" },
    { name: "Find Teachers", href: "/teachers" },
    { name: "Join Classrooms", href: "/classrooms" },
    { name: "Become a Teacher", href: "/become-teacher" },
  ],
  learn: [
    { name: "JLPT Preparation", href: "/courses?category=jlpt" },
    { name: "Business Japanese", href: "/courses?category=business" },
    { name: "Conversation Practice", href: "/courses?category=conversation" },
    { name: "Cultural Studies", href: "/courses?category=culture" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Community Guidelines", href: "/guidelines" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Mission", href: "/mission" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-nihongo-ink-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-crimson">
                <span className="text-lg font-bold text-white">日</span>
              </div>
              <div>
                <span className="text-xl font-heading font-bold">
                  Nihongo Sekai
                </span>
                <p className="text-xs text-nihongo-ink-400 -mt-1">
                  Japanese Learning Platform
                </p>
              </div>
            </div>
            <p className="text-nihongo-ink-300 text-sm mb-6 max-w-sm">
              Master Japanese language and culture through interactive courses,
              live classrooms, and expert guidance. Join our global community of
              learners.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-nihongo-ink-400 hover:text-white transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-nihongo-ink-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Learn</h3>
            <ul className="space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-nihongo-ink-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-nihongo-ink-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-nihongo-ink-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-nihongo-ink-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-sm text-nihongo-ink-300">
                <Mail className="h-4 w-4" />
                <span>support@nihongosekai.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-nihongo-ink-300">
                <Phone className="h-4 w-4" />
                <span>+81 (0) 3-1234-5678</span>
              </div>
            </div>
            <div className="text-sm text-nihongo-ink-400">
              © 2024 Nihongo Sekai. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
