import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/images/logo.png';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Handle RTL/LTR based on language
        const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', i18n.language);
    }, [i18n.language]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <Link to="/" className="logo d-flex align-items-center" style={{ textDecoration: 'none' }}>
                <img src={logoImg} alt="الشعار" style={{ height: '70px', objectFit: 'contain' }} />
                <span className="abadi-text logo-text" style={{ fontSize: '1.8rem', fontWeight: '800', marginInlineStart: '1rem' }}>{t('nav.brand')}</span>
            </Link>

            {location.pathname.startsWith('/admin') ? (
                <div className="nav-links">
                    <Link to="/" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {t('nav.go_to_site')}
                        <ArrowLeft size={18} style={{ transform: i18n.language === 'en' ? 'rotate(180deg)' : 'none' }} />
                    </Link>
                </div>
            ) : (
                <>
                    <div className="nav-links">
                        <Link to="/">{t('nav.home')}</Link>
                        <a href="/#products">{t('nav.services')}</a>
                        <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>{t('nav.gallery')}</Link>
                        <Link
                            to="/admin/login"
                            className={location.pathname === '/admin/login' ? 'active' : ''}
                            style={{ fontWeight: 800 }}
                        >
                            Admin
                        </Link>
                        <a href="/#about">{t('nav.about')}</a>
                    </div>

                    <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="lang-switcher" style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => changeLanguage('ar')} className={`lang-btn ${i18n.language === 'ar' ? 'active' : ''}`}>AR</button>
                            <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}>EN</button>
                            <button onClick={() => changeLanguage('he')} className={`lang-btn ${i18n.language === 'he' ? 'active' : ''}`}>HE</button>
                        </div>
                        <button className="btn-primary nav-contact-btn" onClick={() => window.open('mailto:Fadelfadel2211@gmail.com', '_self')}>
                            {t('nav.contact')} <ArrowLeft size={18} style={{ transform: i18n.language === 'en' ? 'rotate(180deg)' : 'none' }} />
                        </button>
                    </div>
                </>
            )}
        </nav >
    );
}
