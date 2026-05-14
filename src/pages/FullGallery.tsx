import { useEffect, useState, useMemo } from 'react';
import {
    ArrowRight,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiFetch } from '../lib/api';

export default function FullGallery() {
    const { t, i18n } = useTranslation();
    const [gallery, setGallery] = useState<{ id: number, url: string, title: string, details?: string, is_custom?: boolean, type?: string, category?: string }[]>([]);
    const [selectedImage, setSelectedImage] = useState<{ url: string, title: string, details?: string } | null>(null);
    const [filter, setFilter] = useState<'all' | 'kitchen' | 'cabinet' | 'office' | 'laundry'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 12;
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const filterParam = params.get('filter');
        if (filterParam && ['kitchen', 'cabinet', 'office', 'laundry'].includes(filterParam)) {
            setFilter(filterParam as any);
        }
        apiFetch('/api/gallery')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    const regularGallery = data.filter((img: any) => img.type === 'gallery' || !img.type);
                    setGallery(regularGallery);
                }
            })
            .catch(err => console.error("Error fetching images from DB:", err));

        window.scrollTo(0, 0);
    }, []);

    const filteredGallery = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase();
        return gallery
            .filter(item => filter === 'all' || item.category === filter)
            .filter(item => item.title.toLowerCase().includes(normalizedSearch));
    }, [gallery, filter, searchTerm]);

    // Pagination logic
    const totalPages = useMemo(() => {
        return Math.ceil(filteredGallery.length / itemsPerPage);
    }, [filteredGallery.length, itemsPerPage]);

    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredGallery.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredGallery, currentPage, itemsPerPage]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    // Reset page when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchTerm]);

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '100px' }}>
                <section className="portfolio">
                    <div className="section-title">
                        <div className="badge">{t('gallery_page.badge')}</div>
                        <h2>{t('gallery_page.title')}</h2>
                        <p>{t('gallery_page.subtitle')}</p>

                        <div className="filter-tabs" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button
                                className={filter === 'all' ? 'btn-primary' : 'btn-outline'}
                                onClick={() => setFilter('all')}
                            >
                                {t('gallery_page.filters.all')}
                            </button>
                            <button
                                className={filter === 'kitchen' ? 'btn-primary' : 'btn-outline'}
                                onClick={() => setFilter('kitchen')}
                            >
                                {t('gallery_page.filters.kitchen')}
                            </button>
                            <button
                                className={filter === 'cabinet' ? 'btn-primary' : 'btn-outline'}
                                onClick={() => setFilter('cabinet')}
                            >
                                {t('gallery_page.filters.cabinet')}
                            </button>
                            <button
                                className={filter === 'office' ? 'btn-primary' : 'btn-outline'}
                                onClick={() => setFilter('office')}
                            >
                                {t('gallery_page.filters.office')}
                            </button>
                            <button
                                className={filter === 'laundry' ? 'btn-primary' : 'btn-outline'}
                                onClick={() => setFilter('laundry')}
                            >
                                {t('gallery_page.filters.laundry')}
                            </button>
                            <div style={{ width: '100%', maxWidth: '600px', margin: '2rem auto 0' }}>
                                <input 
                                    type="text" 
                                    placeholder={i18n.language === 'ar' ? 'بحث في المعرض...' : i18n.language === 'he' ? 'חפש בגלריה...' : 'Search gallery...'}
                                    className="btn-outline" 
                                    style={{ width: '100%', textAlign: i18n.language === 'en' ? 'left' : 'right', padding: '0.8rem 1.5rem', borderRadius: '1rem' }}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="gallery-grid">
                        {currentItems.map((item) => (
                            <div key={item.id} className="gallery-item animate-fade-in" onClick={() => setSelectedImage({ url: item.url, title: item.title, details: item.details })}>
                                <div className="gallery-img-wrapper">
                                    <img src={item.url} alt={item.title} loading="lazy" />
                                    <div className="gallery-overlay">
                                        <h4>{item.title}</h4>
                                        <span className="badge" style={{ margin: 0, padding: '0.2rem 0.8rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                                            {item.category === 'kitchen' ? t('gallery_page.filters.kitchen') : 
                                             item.category === 'cabinet' ? t('gallery_page.filters.cabinet') :
                                             item.category === 'office' ? t('gallery_page.filters.office') :
                                             item.category === 'laundry' ? t('gallery_page.filters.laundry') : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn pagination-arrow"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {t('gallery_page.pagination.prev')}
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                className="pagination-btn pagination-arrow"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {t('gallery_page.pagination.next')}
                            </button>
                        </div>
                    )}

                    {/* Lightbox */}
                    {selectedImage && (
                        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)}>
                            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                                <X size={24} />
                            </button>
                            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                                <img src={selectedImage.url} alt={selectedImage.title} className="lightbox-image" loading="lazy" />
                                <div className="lightbox-details" style={{ textAlign: i18n.language === 'en' ? 'left' : 'right' }}>
                                    <h3 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '1rem' }}>{selectedImage.title}</h3>
                                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                                        {selectedImage.details || t('gallery_page.lightbox.no_details')}
                                    </p>
                                    <button className="btn-primary" style={{ marginTop: '2rem' }}>{t('gallery_page.lightbox.inquiry')}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
                
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <button onClick={() => navigate('/')} className="btn-outline">
                         <ArrowRight size={18} style={{ 
                             marginLeft: i18n.language === 'en' ? '0' : '10px',
                             marginRight: i18n.language === 'en' ? '10px' : '0',
                             transform: i18n.language === 'en' ? 'rotate(180deg)' : 'none'
                         }} /> {t('gallery_page.back_home')}
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
