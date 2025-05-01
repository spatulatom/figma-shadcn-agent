"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full py-6 relative">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo - always visible */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Whitepace
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Actions section - desktop */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline">Login</Button>
          <Button>Try Whitepace free</Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu - expandable */}
      <div
        className={`absolute top-full left-0 right-0 bg-background border-b border-border shadow-md transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Mobile navigation links */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          {/* Mobile action buttons */}
          <div className="flex flex-col gap-3 pt-3 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Button>
            <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Try Whitepace free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
