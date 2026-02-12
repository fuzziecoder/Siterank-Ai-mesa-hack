import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';

const CardNavLink = ({ label, href, ariaLabel }) => {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="group flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
    >
      <span className="text-sm font-medium">{label}</span>
      <GoArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
};

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const menuRef = useRef(null);
  const cardsRef = useRef([]);
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    if (isOpen) {
      // Animate menu open
      gsap.to(menuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease,
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease,
      });
      // Stagger cards
      gsap.fromTo(
        cardsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease }
      );
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease,
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease,
      });
    }
  }, [isOpen, ease]);

  const handleCardHover = (index) => {
    setActiveCard(index);
    gsap.to(cardsRef.current[index], {
      scale: 1.02,
      duration: 0.2,
      ease,
    });
  };

  const handleCardLeave = (index) => {
    setActiveCard(null);
    gsap.to(cardsRef.current[index], {
      scale: 1,
      duration: 0.2,
      ease,
    });
  };

  return (
    <nav className={`relative z-50 ${className}`}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity ${isOpen ? 'pointer-events-auto' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Main Nav Bar */}
      <div className="relative bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
                  <img src={logo} alt={logoAlt} className="w-6 h-6 object-contain" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-400" style={{ fontFamily: "'Zen Dots', cursive" }}>
                SITERANK AI
              </span>
            </a>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center gap-1">
              {items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  onMouseEnter={() => item.links?.length > 0 && setIsOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Login
              </a>
              <a
                href="/register"
                className="px-5 py-2 text-sm font-medium rounded-full transition-all"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              >
                Get Started
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-current transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          ref={menuRef}
          className="absolute left-0 right-0 overflow-hidden h-0 opacity-0"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.filter(item => item.links?.length > 0).map((item, index) => (
                <div
                  key={item.label}
                  ref={(el) => (cardsRef.current[index] = el)}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={() => handleCardLeave(index)}
                  className="rounded-2xl p-6 transition-all"
                  style={{
                    backgroundColor: item.bgColor,
                    color: item.textColor,
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4">{item.label}</h3>
                  <div className="space-y-1">
                    {item.links.map((link) => (
                      <CardNavLink
                        key={link.label}
                        label={link.label}
                        href={link.href}
                        ariaLabel={link.ariaLabel}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CardNav;
