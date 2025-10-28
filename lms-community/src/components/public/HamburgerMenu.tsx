'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import Button from '../shared/Button';

interface NavLink {
  label: string;
  href: string;
}

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  showAuth?: boolean;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  links,
  showAuth = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-hard z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors group"
                      >
                        <span className="font-medium">{link.label}</span>
                        <FiChevronRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Auth Buttons */}
              {showAuth && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 border-t border-gray-200 space-y-3"
                >
                  <Link href="/login" onClick={onClose} className="block">
                    <Button variant="outline" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={onClose} className="block">
                    <Button variant="primary" fullWidth>
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HamburgerMenu;
