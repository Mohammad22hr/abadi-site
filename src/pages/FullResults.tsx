import { useEffect, useState, useMemo } from 'react';
import {
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiFetch } from '../lib/api';

export default function FullResults() {
    const { t, i18n } = useTranslation();
    const [beforeAfterList, setBeforeAfterList] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch('/api/before-after')
            .then(res => res.json())
            .then(data => setBeforeAfterList(data))
            .catch(err => console.error("Error fetching B/A:", err));

        window.scrollTo(0, 0);
    }, []);

    const totalPages = useMemo(() => {
        return Math.ceil(beforeAfterList.length / itemsPerPage);
    }, [beforeAfterList.length, itemsPerPage]);

    const currentItems = useMemo(() => {
        return beforeAfterList.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [beforeAfterList, currentPage, itemsPerPage]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '100px' }}>
                <section className="portfolio">
                    <div className="section-title">
                        <div className="badge">{t('results_page.badge')}</div>
                        <h2>{t('results_page.title')}</h2>
                        <p>{t('results_page.subtitle')}</p>
                    </div>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {currentItems.map((item) => (
                            <div key={item.id} className="comparison-item animate-fade-in" style={{ background: 'var(--bg-light)', padding: '2rem', borderRadius: '2rem', boxShadow: 'var(--card-shadow)' }}>
                                <div className="before-after-container" style={{ marginBottom: '2rem' }}>
                                    <div className="image-box">
                                        <img src={item.before_url} alt="Before" loading="lazy" />
                                        <span className="badge-comparison before">{t('comparison.before')}</span>
                                    </div>
                                    <div className="image-box">
                                        <img src={item.after_url} alt="After" loading="lazy" />
                                        <span className="badge-comparison after">{t('comparison.after')}</span>
                                    </div>
                                </div>
                                <div className="comparison-text" style={{ textAlign: 'center' }}>
                                    <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--accent)' }}>{item.title}</h3>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination" style={{ marginTop: '5rem' }}>
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
                </section>
                
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <button onClick={() => navigate('/')} className="btn-outline">
                         <ArrowRight size={18} style={{ 
                             marginLeft: i18n.language === 'en' ? '0' : '10px',
                             marginRight: i18n.language === 'en' ? '10px' : '0',
                             transform: i18n.language === 'en' ? 'rotate(180deg)' : 'none'
                         }} /> {t('results_page.back_home')}
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
