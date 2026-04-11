// src/components/Header.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useContatoConfig, buildWhatsappUrl } from '@/hooks/useContatoConfig';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { LOGO_URL } from '@/config/site';
import DesktopNav from '@/components/header/DesktopNav';
import MobileMenu from '@/components/header/MobileMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = ({ siteConfig }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const location                            = useLocation();
  const { i18n }                            = useTranslation();
  const { isAuthenticated }                 = useAuth();
  const config                              = useContatoConfig();
  const { settings }                        = useSiteSettings();
  const logoHeight                          = Number(settings?.logo_size_header) || 56;
  const useResizeObserver                   = settings?.perf_header_resize_observer !== 'false';
  const headerRef                           = useRef(null);

  // Publica a altura real do header como CSS var --header-h
  // Usado pelo spacer no AppShell para evitar sobreposição do conteúdo
  useLayoutEffect(() => {
    const update = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          '--header-h',
          headerRef.current.offsetHeight + 'px'
        );
      }
    };

    update();

    if (!useResizeObserver) {
      window.addEventListener('resize', update, { passive: true });
      return () => window.removeEventListener('resize', update);
    }

    const ro = new ResizeObserver(update);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [logoHeight, useResizeObserver]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const isActive    = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const whatsappUrl = buildWhatsappUrl(config.whatsapp, config.mensagem_header, i18n.resolvedLanguage);
  const logoUrl = siteConfig?.logo_url || LOGO_URL;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-secondary/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-secondary'
      }`}
    >
      <div className="container-custom flex items-center justify-between py-4">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logoUrl}
            alt="Instituto Milhomem"
            style={{ height: logoHeight }}
            className="object-contain"
          />
        </Link>

        <DesktopNav isActive={isActive} whatsappUrl={whatsappUrl} isAuthenticated={isAuthenticated} />

        {/* Mobile: seletor de idioma sempre visível na barra + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            className="text-white/80 hover:text-white p-2 transition-colors"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      <MobileMenu
        open={mobileMenuOpen}
        isActive={isActive}
        config={config}
        whatsappUrl={whatsappUrl}
      />
    </header>
  );
};

export default Header;
