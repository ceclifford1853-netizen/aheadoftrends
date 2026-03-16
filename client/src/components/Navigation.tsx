import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about-us" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xl font-bold glow-cyan text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Ahead of Trends</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            onClick={() => navigate("/alpha-rating")}
            className="btn-neon-cyan text-sm"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-cyan-400 hover:text-cyan-300"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setIsOpen(false);
                }}
                className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium text-left"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => {
                navigate("/alpha-rating");
                setIsOpen(false);
              }}
              className="btn-neon-cyan w-full text-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
