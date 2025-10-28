'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  className?: string;
}

const defaultSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Courses', href: '/courses' },
      { label: 'Teachers', href: '/teachers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'API', href: '/api' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Licenses', href: '/licenses' },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { icon: <FiFacebook size={20} />, href: '#', label: 'Facebook' },
  { icon: <FiTwitter size={20} />, href: '#', label: 'Twitter' },
  { icon: <FiInstagram size={20} />, href: '#', label: 'Instagram' },
  { icon: <FiLinkedin size={20} />, href: '#', label: 'LinkedIn' },
  { icon: <FiGithub size={20} />, href: '#', label: 'GitHub' },
];

const Footer: React.FC<FooterProps> = ({
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  contactInfo = {
    email: 'info@lmscommunity.com',
    phone: '+1 (555) 123-4567',
    address: '123 Learning Street, Education City, EC 12345',
  },
  className,
}) => {
  return (
    <footer className={cn('bg-gray-900 text-gray-300', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-white">LMS Community</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Empowering learners worldwide with cutting-edge education technology
              and comprehensive learning solutions.
            </p>

            {/* Contact Info */}
            {contactInfo && (
              <div className="space-y-3">
                {contactInfo.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FiMail className="text-primary-500" />
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="hover:text-primary-500 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FiPhone className="text-primary-500" />
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="hover:text-primary-500 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                )}
                {contactInfo.address && (
                  <div className="flex items-start space-x-2 text-sm">
                    <FiMapPin className="text-primary-500 mt-0.5" />
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} LMS Community. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
