import { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import heroImg from '../assets/images/kitchen_hero.png';
import gal1 from '../assets/images/gal_1.png';
import gal2 from '../assets/images/gal_2.png';
import gal3 from '../assets/images/gal_3.png';

const initialGallery = [
    { id: 1, url: gal1, title: 'مطبخ حديث - خشب الجوز داكن' },
    { id: 2, url: gal2, title: 'تفاصيل دقيقة ومقابض ذهبية' },
    { id: 3, url: gal3, title: 'جزيرة مطبخ من الرخام والخشب' },
    { id: 4, url: heroImg, title: 'فخامة خشب البلوط' },
];

export default function Portfolio() {
    const [gallery, setGallery] = useState<{ id: number, url: string, title: string, isCustom?: boolean }[]>(initialGallery);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load saved gallery from local device storage (IndexedDB)
        localforage.getItem('elegent_gallery').then((savedGallery: any) => {
            if (savedGallery && Array.isArray(savedGallery)) {
                setGallery(savedGallery);
            } else {
                localforage.setItem('elegent_gallery', initialGallery);
            }
        }).catch(err => console.error("Error loading gallery from storage", err));

        // Scroll to top when page opens
        window.scrollTo(0, 0);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const newImage = {
                    id: Date.now(),
                    url: base64String,
                    title: file.name.split('.')[0] || 'عمل جديد',
                    isCustom: true
                };

                const newGallery = [newImage, ...gallery];
                setGallery(newGallery);
                localforage.setItem('elegent_gallery', newGallery);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const handleDelete = (id: number) => {
        const newGallery = gallery.filter(item => item.id !== id);
        setGallery(newGallery);
        localforage.setItem('elegent_gallery', newGallery);
    };

    return (
        <main>
            <section className="portfolio" style={{ minHeight: '100vh', paddingTop: '10rem' }}>
                <div className="section-title">
                    <div className="badge">أعمالنا السابقة</div>
                    <h2>معرض صور أعمال التجهيزات الخشبية</h2>
                    <p>مجموعة من أعمالنا الفاخرة التي تم تنفيذها بكل شغف واهتمام. يمكنك إضافة صور جديدة للعرض.</p>

                    <div className="upload-container">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <button
                            className="btn-primary"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ marginTop: '1.5rem', background: '#fcfcfc', color: '#050505' }}
                        >
                            <Plus size={20} /> إضافة عمل جديد
                        </button>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
                            هذه الصور محفوظة على متصفحك بشكل دائم بفضل تقنية المتصفح
                        </p>
                    </div>
                </div>

                <div className="gallery-grid">
                    {gallery.map((item) => (
                        <div key={item.id} className="gallery-item animate-fade-in">
                            <div className="gallery-img-wrapper">
                                <img src={item.url} alt={item.title} />
                                <div className="gallery-overlay">
                                    <ImageIcon size={32} color="#ffffff" />
                                    <h4>{item.title}</h4>
                                </div>
                                {item.isCustom && (
                                    <button
                                        className="gallery-delete"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                        title="حذف الصورة"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
