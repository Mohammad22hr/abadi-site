import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    Ruler,
    Layers,
    CheckCircle2,
    X,
    Palette,
    Shield,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiFetch } from '../lib/api';

import heroImg from '../assets/images/hero.png';
import showcaseImg from '../assets/images/showcase.png';

const initialGallery: any[] = [];

export default function Landing() {
    const { t, i18n } = useTranslation();
    const [gallery, setGallery] = useState<{ id: number, url: string, title: string, details?: string, is_custom?: boolean, type?: string, category?: string }[]>(initialGallery);
    const [beforeAfterList, setBeforeAfterList] = useState<any[]>([]);
    const [heroSlides, setHeroSlides] = useState<string[]>([heroImg, showcaseImg]);
    const [activeHeroSlide, setActiveHeroSlide] = useState<number>(0);
    const [aboutImage, setAboutImage] = useState<string>(showcaseImg);
    const [specKitchen, setSpecKitchen] = useState<string>(showcaseImg);
    const [specCabinet, setSpecCabinet] = useState<string>('https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000&auto=format&fit=crop');
    const [specOffice, setSpecOffice] = useState<string>('https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop');
    const [specLaundry, setSpecLaundry] = useState<string>('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop');
    const [selectedImage, setSelectedImage] = useState<{ url: string, title: string, details?: string } | null>(null);
    const [currentBAIndex, setCurrentBAIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'kitchen' | 'cabinet' | 'office' | 'laundry'>('kitchen');

    // Avoid filtering the full gallery multiple times per render.
    const featuredGallery = useMemo(() => {
        return gallery.filter(img => img.category === activeTab);
    }, [gallery, activeTab]);

    // Contact Form State
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactService, setContactService] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch gallery from PostgreSQL API
        apiFetch('/api/gallery')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    // Separate system images from gallery
                    const systemHero = data.find(img => img.type === 'hero');
                    const systemShowcase = data.find(img => img.type === 'showcase'); // Backwards compatibility
                    const systemAbout = data.find(img => img.type === 'about');
                    const systemSpecKitchen = data.find(img => img.type === 'specialty_kitchen');
                    const systemSpecCabinet = data.find(img => img.type === 'specialty_cabinet');
                    const systemSpecOffice = data.find(img => img.type === 'specialty_office');
                    const systemSpecLaundry = data.find(img => img.type === 'specialty_laundry');
                    
                    const regularGallery = data.filter(img => img.type === 'gallery' || !img.type);

                    if (systemAbout) setAboutImage(systemAbout.url);
                    else if (systemShowcase) setAboutImage(systemShowcase.url);

                    if (systemSpecKitchen) setSpecKitchen(systemSpecKitchen.url);
                    else if (systemShowcase) setSpecKitchen(systemShowcase.url);

                    if (systemSpecCabinet) setSpecCabinet(systemSpecCabinet.url);
                    if (systemSpecOffice) setSpecOffice(systemSpecOffice.url);
                    if (systemSpecLaundry) setSpecLaundry(systemSpecLaundry.url);

                    // Build hero slider images from system entries (fallback to defaults).
                    const slides = [
                        systemHero?.url,
                        systemShowcase?.url,
                        systemAbout?.url,
                    ].filter(Boolean) as string[];
                    if (slides.length > 0) {
                        setHeroSlides(slides);
                        setActiveHeroSlide(0);
                    }

                    // For the main gallery, we can still show initial images if empty, 
                    // but here we merge or just show DB gallery
                    setGallery([...regularGallery, ...initialGallery]);
                }
            })
            .catch(err => console.error("Error fetching images from DB:", err));

        apiFetch('/api/before-after')
            .then(res => res.json())
            .then(data => setBeforeAfterList(data))
            .catch(err => console.error("Error fetching B/A:", err));

        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!heroSlides || heroSlides.length <= 1) return;
        const id = window.setInterval(() => {
            setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => window.clearInterval(id);
    }, [heroSlides.length]);

    const nextBA = () => {
        setCurrentBAIndex((prev) => (prev + 1) % (beforeAfterList.length || 1));
    };

    const prevBA = () => {
        setCurrentBAIndex((prev) => (prev - 1 + (beforeAfterList.length || 1)) % (beforeAfterList.length || 1));
    };

    const handleContactSubmit = async () => {
        if (!contactName || !contactPhone) {
            alert(t('contact.form.alert_fill'));
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiFetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: contactName,
                    phone: contactPhone,
                    service: contactService,
                    message: contactMessage
                })
            });

            const data = await response.json();
            alert(data.message);

            // Clear form
            setContactName('');
            setContactPhone('');
            setContactService('');
            setContactMessage('');
        } catch (err) {
            console.error(err);
            alert(t('contact.form.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ background: 'var(--bg-color)' }}>
            <Navbar />

            <main>
                {/* Hero Section */}
                <section id="home" className="hero hero-slider">
                    <div className="hero-slides" aria-hidden="true">
                        {heroSlides.map((src, i) => (
                            <div
                                key={`${src}-${i}`}
                                className={`hero-slide ${i === activeHeroSlide ? 'active' : ''}`}
                                style={{ backgroundImage: `url(${src})` }}
                            />
                        ))}
                    </div>
                    <div className="hero-content animate-fade-in delay-1">
                        <h1>{t('hero.title').split(' ').map((word, i) => i === 2 ? <span key={i}>{word} </span> : word + ' ')}</h1>
                        <p>{t('hero.subtitle')}</p>
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={() => window.open('mailto:Fadelfadel2211@gmail.com', '_self')}>
                                {t('hero.cta_consult')} <ArrowLeft size={18} style={{ transform: i18n.language === 'en' ? 'rotate(180deg)' : 'none' }} />
                            </button>
                            <a href="#portfolio" className="btn-outline" style={{ textDecoration: 'none', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                                {t('hero.cta_gallery')}
                            </a>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="about-section">
                    <div className="about-image">
                        <img src={aboutImage} alt="About Us" />
                    </div>
                    <div className="about-content">
                        <h2>{t('about.title')}</h2>
                        <p>{t('about.desc1')}</p>
                        <p>{t('about.desc2')}</p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <h4>15+</h4>
                                <p>{t('about.stats.years')}</p>
                            </div>
                            <div className="stat-item">
                                <h4>500+</h4>
                                <p>{t('about.stats.projects')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features/Services Section */}
                <section id="services" className="why-us">
                    <div className="section-title animate-fade-in delay-3">
                        <h2>{t('features.title')}</h2>
                        <p>{t('features.subtitle')}</p>
                    </div>

                    <div className="why-us-grid">
                        <div className="why-card">
                            <div className="why-icon"><Ruler size={32} /></div>
                            <h3>{t('features.design.title')}</h3>
                            <p>{t('features.design.desc')}</p>
                        </div>

                        <div className="why-card">
                            <div className="why-icon"><Palette size={32} /></div>
                            <h3>{t('features.diversity.title')}</h3>
                            <p>{t('features.diversity.desc')}</p>
                        </div>

                        <div className="why-card">
                            <div className="why-icon"><Layers size={32} /></div>
                            <h3>{t('features.quality.title')}</h3>
                            <p>{t('features.quality.desc')}</p>
                        </div>

                        <div className="why-card">
                            <div className="why-icon"><Shield size={32} /></div>
                            <h3>{t('features.warranty.title')}</h3>
                            <p>{t('features.warranty.desc')}</p>
                        </div>
                    </div>
                </section>

                {/* Products Split Showcase */}
                <section id="products" className="products-showcase">
                    <div className="section-title">
                        <h2>{t('specialties.title')}</h2>
                        <p>{t('specialties.subtitle')}</p>
                    </div>
                    <div className="products-grid">
                        {/* Modern Kitchens */}
                        <div className="product-card" style={{ backgroundImage: `url(${specKitchen})` }}>
                            <div className="product-overlay">
                                <h3>{t('specialties.kitchens.title')}</h3>
                                <ul className="checklist">
                                    {(t('specialties.kitchens.list', { returnObjects: true }) as string[]).map((item, i) => (
                                        <li key={i}><CheckCircle2 size={18} /> {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Cabinets & Closets */}
                        <div className="product-card" style={{ backgroundImage: `url(${specCabinet})` }}>
                            <div className="product-overlay">
                                <h3>{t('specialties.cabinets.title')}</h3>
                                <ul className="checklist">
                                    {(t('specialties.cabinets.list', { returnObjects: true }) as string[]).map((item, i) => (
                                        <li key={i}><CheckCircle2 size={18} /> {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Home Offices */}
                        <div className="product-card" style={{ backgroundImage: `url(${specOffice})` }}>
                            <div className="product-overlay">
                                <h3>{t('specialties.offices.title')}</h3>
                                <ul className="checklist">
                                    {(t('specialties.offices.list', { returnObjects: true }) as string[]).map((item, i) => (
                                        <li key={i}><CheckCircle2 size={18} /> {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Laundry & Bathrooms */}
                        <div className="product-card" style={{ backgroundImage: `url(${specLaundry})` }}>
                            <div className="product-overlay">
                                <h3>{t('specialties.laundry.title')}</h3>
                                <ul className="checklist">
                                    {(t('specialties.laundry.list', { returnObjects: true }) as string[]).map((item, i) => (
                                        <li key={i}><CheckCircle2 size={18} /> {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portfolio Gallery Section (PUBLIC VIEW) */}
                <section id="portfolio" className="portfolio">
                    <div className="section-title">
                        <div className="badge">{t('portfolio.badge')}</div>
                        <h2>{t('portfolio.title')}</h2>
                        <p>{t('portfolio.subtitle')}</p>

                        <div className="filter-tabs" style={{ marginTop: '3rem' }}>
                            {[
                                { id: 'kitchen', title: t('portfolio.tabs.kitchen') },
                                { id: 'cabinet', title: t('portfolio.tabs.cabinet') },
                                { id: 'office', title: t('portfolio.tabs.office') },
                                { id: 'laundry', title: t('portfolio.tabs.laundry') }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={activeTab === tab.id ? 'btn-primary' : 'btn-outline'}
                                    style={{
                                        padding: '0.8rem 2.5rem',
                                        borderRadius: '50px',
                                        fontSize: '1rem',
                                        border: activeTab === tab.id ? 'none' : '1px solid var(--glass-border)'
                                    }}
                                    onClick={() => setActiveTab(tab.id as any)}
                                >
                                    {tab.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="gallery-grid" key={activeTab}>
                        {featuredGallery
                            .slice(0, 4) // Show up to 4 featured images per category on landing
                            .map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`gallery-item animate-fade-in delay-${(index % 3) + 1}`}
                                    onClick={() => setSelectedImage({ url: item.url, title: item.title, details: item.details })}
                                >
                                    <div className="gallery-img-wrapper">
                                        <img src={item.url} alt={item.title} loading="lazy" />
                                        <div className="gallery-overlay">
                                            <h4>{item.title}</h4>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{item.details?.substring(0, 50)}...</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* Fallback if no images found for category */}
                        {featuredGallery.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--bg-light)', borderRadius: '2rem' }}>
                                <p style={{ color: 'var(--text-muted)' }}>{t('portfolio.empty_category')}</p>
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                        <Link to={`/gallery?filter=${activeTab}`} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            {t('portfolio.view_all')} {
                                activeTab === 'kitchen' ? t('portfolio.tabs.kitchen_plural') :
                                    activeTab === 'cabinet' ? t('portfolio.tabs.cabinet_plural') :
                                        activeTab === 'office' ? t('portfolio.tabs.office_plural') : t('portfolio.tabs.laundry_plural')
                            }
                            <ArrowLeft size={18} />
                        </Link>
                    </div>
                    {/* Lightbox */}
                    {selectedImage && (
                        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)}>
                            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                                <X size={24} />
                            </button>
                            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                                <img src={selectedImage.url} alt={selectedImage.title} className="lightbox-image" loading="lazy" />
                                <div className="lightbox-details" style={{ textAlign: 'right' }}>
                                    <h3 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '1rem' }}>{selectedImage.title}</h3>
                                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                                        {selectedImage.details || t('portfolio.no_details')}
                                    </p>
                                    <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.open('mailto:Fadelfadel2211@gmail.com', '_self')}>{t('portfolio.contact_us')}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>


                {/* Comparison Section */}
                <section className="comparison-section">
                    <div className="section-title">
                        <h2>{t('comparison.title')}</h2>
                        <p>{t('comparison.subtitle')}</p>
                    </div>

                    <div className="comparison-slider">
                        {beforeAfterList.length > 0 ? (
                            <div className="comparison-item">
                                <div className="comparison-visuals">
                                    <button className="arrow-nav left" onClick={prevBA}><ArrowLeft style={{ transform: i18n.language === 'en' ? 'rotate(0deg)' : 'rotate(180deg)' }} /></button>
                                    <div className="before-after-container">
                                        <div className="image-box">
                                            <img src={beforeAfterList[currentBAIndex].before_url} alt="Before" />
                                            <span className="badge-comparison before">{t('comparison.before')}</span>
                                        </div>
                                        <div className="image-box">
                                            <img src={beforeAfterList[currentBAIndex].after_url} alt="After" />
                                            <span className="badge-comparison after">{t('comparison.after')}</span>
                                        </div>
                                    </div>
                                    <button className="arrow-nav right" onClick={nextBA}><ArrowLeft style={{ transform: i18n.language === 'en' ? 'rotate(180deg)' : 'rotate(0deg)' }} /></button>
                                </div>
                                <div className="comparison-text">
                                    <h3>{beforeAfterList[currentBAIndex].title}</h3>
                                    <p>{beforeAfterList[currentBAIndex].description}</p>
                                </div>
                                <div className="slider-dots">
                                    {beforeAfterList.map((_, i) => (
                                        <div key={i} className={`dot ${currentBAIndex === i ? 'active' : ''}`} onClick={() => setCurrentBAIndex(i)}></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="comparison-item">
                                <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-light)', borderRadius: '2rem' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>{t('comparison.empty')}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {beforeAfterList.length > 0 && (
                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                            <Link to="/results" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                {t('portfolio.view_all')} {t('comparison.title')}
                                <ArrowLeft size={18} style={{ transform: i18n.language === 'en' ? 'rotate(180deg)' : 'none' }} />
                            </Link>
                        </div>
                    )}
                </section>

                {/* Contact Section */}
                <section id="contact" className="contact-action">
                    <div className="action-container">
                        <h2>{t('contact.title')}</h2>
                        <p>{t('contact.subtitle')}</p>

                        <div className="contact-cards">
                            <div className="contact-item">
                                <div className="contact-icon"><Phone size={24} /></div>
                                <span>{t('contact.info.phone')}</span>
                                <strong>052-3230965</strong>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon"><Mail size={24} /></div>
                                <span>{t('contact.info.email')}</span>
                                <strong> Fadelfadel2211@gmail.com</strong>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon"><MapPin size={24} /></div>
                                <span>{t('contact.info.address')}</span>
                                <strong>{t('contact.info.addressValue')}</strong>
                            </div>
                        </div>

                        <div className="contact-form-container">
                            <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <input
                                    type="text"
                                    placeholder={t('contact.form.name')}
                                    style={{ padding: '1rem', borderRadius: '12px', border: 'none' }}
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder={t('contact.form.phone')}
                                    style={{ padding: '1rem', borderRadius: '12px', border: 'none' }}
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                />
                            </div>
                            <div style={{ marginTop: '1.5rem' }}>
                                <select
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#1a1a1a', fontSize: '1rem' }}
                                    value={contactService}
                                    onChange={(e) => setContactService(e.target.value)}
                                >
                                    <option value="" disabled>{t('contact.form.service')}</option>
                                    <option value="مطابخ">{t('contact.form.service_kitchen')}</option>
                                    <option value="خزائن ملابس">{t('contact.form.service_cabinet')}</option>
                                    <option value="مكاتب">{t('contact.form.service_office')}</option>
                                    <option value="غرف غسيل وحمامات">{t('contact.form.service_laundry')}</option>
                                    <option value="تجديد وصيانة">{t('contact.form.service_renovation')}</option>
                                </select>
                            </div>
                            <textarea
                                placeholder={t('contact.form.message')}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', marginTop: '1.5rem', minHeight: '120px' }}
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                            ></textarea>
                            <button
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem', fontSize: '1.1rem' }}
                                onClick={handleContactSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
