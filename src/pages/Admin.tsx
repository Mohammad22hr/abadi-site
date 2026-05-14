import { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Trash2, X, Edit2, Save, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/images/hero.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiFetch } from '../lib/api';

export default function Admin() {
    const [gallery, setGallery] = useState<{ id: number, url: string, title: string, details?: string, is_custom?: boolean, type?: string, category?: string }[]>([]);
    const [heroImage, setHeroImage] = useState<string>(heroImg);
    const [aboutImage, setAboutImage] = useState<string>('');
    const [specKitchen, setSpecKitchen] = useState<string>('');
    const [specCabinet, setSpecCabinet] = useState<string>('');
    const [specOffice, setSpecOffice] = useState<string>('');
    const [specLaundry, setSpecLaundry] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<{ url: string, title: string, details?: string } | null>(null);
    const [beforeAfterList, setBeforeAfterList] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentBAPage, setCurrentBAPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [adminFilter, setAdminFilter] = useState<'all' | 'kitchen' | 'cabinet' | 'office' | 'laundry'>('all');

    // New Image Form State
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDetails, setNewDetails] = useState('');
    const [category, setCategory] = useState<'kitchen' | 'cabinet' | 'office' | 'laundry'>('kitchen');
    const [isUploading, setIsUploading] = useState(false);

    // Before/After Form State
    const [baTitle, setBaTitle] = useState('');
    const [baBefore, setBaBefore] = useState<string | null>(null);
    const [baAfter, setBaAfter] = useState<string | null>(null);
    const [baUploading, setBaUploading] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDetails, setEditDetails] = useState('');
    const [editCategory, setEditCategory] = useState<'kitchen' | 'cabinet' | 'office' | 'laundry'>('kitchen');

    const fileInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        apiFetch('/api/gallery')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    const systemHero = data.find(img => img.type === 'hero');
                    const systemAbout = data.find(img => img.type === 'about');
                    const systemSpecKitchen = data.find(img => img.type === 'specialty_kitchen');
                    const systemSpecCabinet = data.find(img => img.type === 'specialty_cabinet');
                    const systemSpecOffice = data.find(img => img.type === 'specialty_office');
                    const systemSpecLaundry = data.find(img => img.type === 'specialty_laundry');

                    const regularGallery = data.filter(img => img.type === 'gallery' || !img.type);

                    if (systemHero) setHeroImage(systemHero.url);
                    if (systemAbout) setAboutImage(systemAbout.url);
                    if (systemSpecKitchen) setSpecKitchen(systemSpecKitchen.url);
                    if (systemSpecCabinet) setSpecCabinet(systemSpecCabinet.url);
                    if (systemSpecOffice) setSpecOffice(systemSpecOffice.url);
                    if (systemSpecLaundry) setSpecLaundry(systemSpecLaundry.url);

                    setGallery(regularGallery);
                }
            })
            .catch(err => console.error("Error fetching images from DB:", err));

        apiFetch('/api/before-after')
            .then(res => res.json())
            .then(data => setBeforeAfterList(data))
            .catch(err => console.error("Error fetching B/A:", err));
    }, []);

    const handleSystemImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'about' | 'specialty_kitchen' | 'specialty_cabinet' | 'specialty_office' | 'specialty_laundry') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                apiFetch('/api/system-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type,
                        url: base64String,
                        title: type === 'hero' ? 'Abadi Hero' : 'Abadi Showcase'
                    })
                })
                    .then(res => res.json())
                    .then(updated => {
                        if (type === 'hero') setHeroImage(updated.url);
                        else if (type === 'about') setAboutImage(updated.url);
                        else if (type === 'specialty_kitchen') setSpecKitchen(updated.url);
                        else if (type === 'specialty_cabinet') setSpecCabinet(updated.url);
                        else if (type === 'specialty_office') setSpecOffice(updated.url);
                        else if (type === 'specialty_laundry') setSpecLaundry(updated.url);
                        alert('تم تحديث الصورة بنجاح!');
                    })
                    .catch(err => console.error("System upload error:", err));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result as string);
                setNewTitle(file.name.split('.')[0] || 'عمل جديد');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadSubmit = () => {
        if (!tempImage) return;
        setIsUploading(true);
        apiFetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                details: newDetails,
                url: tempImage,
                isCustom: true,
                category: category
              })
        })
            .then(res => res.json())
            .then(newImage => {
                setGallery([newImage, ...gallery]);
                setTempImage(null);
                setNewTitle('');
                setNewDetails('');
                setIsUploading(false);
                alert('تمت إضافة الصورة بنجاح!');
            });
    };

    const handleBAUpload = () => {
        if (!baBefore || !baAfter) {
            alert('يرجى اختيار صورتين (قبل وبعد) أولاً');
            return;
        }
        console.log("Attempting to save B/A to:", '/api/before-after');
        setBaUploading(true);
        apiFetch('/api/before-after', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: baTitle || 'مشروع جديد',
                before_url: baBefore,
                after_url: baAfter,
                description: ''
            })
        })
            .then(res => {
                console.log("Server response status:", res.status);
                if (!res.ok) throw new Error('Server responded with ' + res.status);
                return res.json();
            })
            .then(newItem => {
                console.log("Saved project:", newItem);
                setBeforeAfterList([newItem, ...beforeAfterList]);
                setBaTitle('');
                setBaBefore(null);
                setBaAfter(null);
                setBaUploading(false);
                alert('تمت إضافة المقارنة بنجاح!');
            })
            .catch(err => {
                console.error("BA Upload error details:", err);
                alert('فشل حفظ المقارنة: ' + err.message);
                setBaUploading(false);
            });
    };

    const handleDeleteBA = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه المقارنة؟')) {
            apiFetch(`/api/before-after/${id}`, {
                method: 'DELETE'
            })
                .then(() => setBeforeAfterList(beforeAfterList.filter(item => item.id !== id)))
                .catch(err => console.error(err));
        }
    };

    const handleBAFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'before') setBaBefore(reader.result as string);
                else setBaAfter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = (id: number) => {
        apiFetch(`/api/gallery/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: editTitle,
                details: editDetails,
                category: editCategory
            })
        })
            .then(res => res.json())
            .then(updated => {
                setGallery(gallery.map(img => img.id === id ? updated : img));
                setEditingId(null);
                alert('تم التعديل بنجاح!');
            })
            .catch(err => console.error("Update error:", err));
    };

    const startEditing = (item: any) => {
        setEditingId(item.id);
        setEditTitle(item.title);
        setEditDetails(item.details || '');
        setEditCategory(item.category || 'kitchen');
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
            apiFetch(`/api/gallery/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    const newGallery = gallery.filter(item => item.id !== id);
                    setGallery(newGallery);
                    if (editingId === id) setEditingId(null);
                })
                .catch(err => console.error("Delete error:", err));
        }
    };

    const itemsPerPage = 8;
    const baItemsPerPage = 6;

    const filteredGallery = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase();
        return gallery
            .filter(item => adminFilter === 'all' || item.category === adminFilter)
            .filter(item => item.title.toLowerCase().includes(normalizedSearch));
    }, [gallery, adminFilter, searchTerm]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredGallery.length / itemsPerPage);
    }, [filteredGallery.length, itemsPerPage]);

    const totalBAPages = useMemo(() => {
        return Math.ceil(beforeAfterList.length / baItemsPerPage);
    }, [beforeAfterList.length, baItemsPerPage]);

    const currentBAItems = useMemo(() => {
        return beforeAfterList.slice(
            (currentBAPage - 1) * baItemsPerPage,
            currentBAPage * baItemsPerPage
        );
    }, [beforeAfterList, currentBAPage]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [adminFilter, searchTerm]);

    useEffect(() => {
        setCurrentBAPage(1);
    }, [beforeAfterList.length]);

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
            <Navbar />

            <main style={{ paddingTop: '100px' }}>
                <section className="portfolio">
                    <div className="section-title">
                        <div className="badge">لوحة التحكم</div>
                        <h2>إدارة محتوى الموقع</h2>
                        <p>يمكنك من هنا تغيير الصور الأساسية وإضافة أعمال جديدة للمعرض.</p>
                        <div style={{ marginTop: '1.5rem' }}>
                            <Link to="/" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                <ArrowRight size={18} />
                                العودة للموقع
                            </Link>
                            <button
                                className="btn-outline"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginInlineStart: '0.75rem' }}
                                onClick={async () => {
                                    try {
                                        await apiFetch('/api/admin/logout', { method: 'POST' });
                                    } finally {
                                        window.location.href = '/admin/login';
                                    }
                                }}
                            >
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-color)', padding: '3rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', marginBottom: '4rem', boxShadow: 'var(--card-shadow)' }}>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>تغيير صور الواجهة الرئيسية والأقسام</h3>
                        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                            <div className="feature-card" style={{ background: 'var(--bg-light)' }}>
                                <h4>صورة الخلفية (Hero)</h4>
                                <div style={{ height: '180px', margin: '1.5rem 0', borderRadius: '1rem', overflow: 'hidden' }}>
                                    <img src={heroImage || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Hero" />
                                </div>
                                <input type="file" id="heroFileInput" style={{ display: 'none' }} onChange={(e) => handleSystemImageUpload(e, 'hero')} />
                                <button className="btn-outline" style={{ width: '100%' }} onClick={() => document.getElementById('heroFileInput')?.click()}>تغيير الصورة</button>
                            </div>

                            <div className="feature-card" style={{ background: 'var(--bg-light)' }}>
                                <h4>صورة من نحن</h4>
                                <div style={{ height: '180px', margin: '1.5rem 0', borderRadius: '1rem', overflow: 'hidden' }}>
                                    <img src={aboutImage || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="About Us" />
                                </div>
                                <input type="file" id="aboutFileInput" style={{ display: 'none' }} onChange={(e) => handleSystemImageUpload(e, 'about')} />
                                <button className="btn-outline" style={{ width: '100%' }} onClick={() => document.getElementById('aboutFileInput')?.click()}>تغيير الصورة</button>
                            </div>

                            <div className="feature-card" style={{ background: 'var(--bg-light)' }}>
                                <h4>خدماتنا: مطابخ</h4>
                                <div style={{ height: '180px', margin: '1.5rem 0', borderRadius: '1rem', overflow: 'hidden' }}>
                                    <img src={specKitchen || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Kitchen Service" />
                                </div>
                                <input type="file" id="kitchenFileInput" style={{ display: 'none' }} onChange={(e) => handleSystemImageUpload(e, 'specialty_kitchen')} />
                                <button className="btn-outline" style={{ width: '100%' }} onClick={() => document.getElementById('kitchenFileInput')?.click()}>تغيير الصورة</button>
                            </div>

                            <div className="feature-card" style={{ background: 'var(--bg-light)' }}>
                                <h4>خدماتنا: خزائن</h4>
                                <div style={{ height: '180px', margin: '1.5rem 0', borderRadius: '1rem', overflow: 'hidden' }}>
                                    <img src={specCabinet || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cabinet Service" />
                                </div>
                                <input type="file" id="cabinetFileInput" style={{ display: 'none' }} onChange={(e) => handleSystemImageUpload(e, 'specialty_cabinet')} />
                                <button className="btn-outline" style={{ width: '100%' }} onClick={() => document.getElementById('cabinetFileInput')?.click()}>تغيير الصورة</button>
                            </div>

                            <div className="feature-card" style={{ background: 'var(--bg-light)' }}>
                                <h4>خدماتنا: مكاتب</h4>
                                <div style={{ height: '180px', margin: '1.5rem 0', borderRadius: '1rem', overflow: 'hidden' }}>
                                    <img src={specOffice || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Office Service" />
                                </div>
                                <input type="file" id="officeFileInput" style={{ display: 'none' }} onChange={(e) => handleSystemImageUpload(e, 'specialty_office')} />
                                <button className="btn-outline" style={{ width: '100%' }} onClick={() => document.getElementById('officeFileInput')?.click()}>تغيير الصورة</button>
                            </div>

                            <div className="feature-card" style={{ background: 'var(--bg-light)' }}>
                                <h4>خدماتنا: حمامات</h4>
                                <div style={{ height: '180px', margin: '1.5rem 0', borderRadius: '1rem', overflow: 'hidden' }}>
                                    <img src={specLaundry || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Laundry Service" />
                                </div>
                                <input type="file" id="laundryFileInput" style={{ display: 'none' }} onChange={(e) => handleSystemImageUpload(e, 'specialty_laundry')} />
                                <button className="btn-outline" style={{ width: '100%' }} onClick={() => document.getElementById('laundryFileInput')?.click()}>تغيير الصورة</button>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#fff', padding: '3rem', borderRadius: '1.5rem', border: '1px dashed var(--accent)', marginBottom: '4rem', boxShadow: 'var(--card-shadow)' }}>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>إضافة عمل جديد للمعرض</h3>
                        {!tempImage ? (
                            <div style={{ textAlign: 'center' }}>
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} />
                                <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                                    <Plus size={20} style={{ marginLeft: '10px' }} /> رفع صورة جديدة
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                <div style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                                    <img src={tempImage} style={{ width: '100%', height: 'auto' }} alt="Preview" />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>عنوان العمل</label>
                                        <input type="text" className="btn-outline" style={{ width: '100%', textAlign: 'right', borderRadius: '1rem' }} value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>التنصيف</label>
                                        <select className="btn-outline" style={{ width: '100%', textAlign: 'right', borderRadius: '1rem', background: 'transparent' }} value={category} onChange={e => setCategory(e.target.value as any)}>
                                            <option value="kitchen">مطبخ</option>
                                            <option value="cabinet">خزانة ملابس</option>
                                            <option value="office">مكاتب</option>
                                            <option value="laundry">غرف غسيل وحمامات</option>
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>تفاصيل إضافية</label>
                                        <textarea className="btn-outline" rows={4} style={{ width: '100%', textAlign: 'right', borderRadius: '1rem', height: 'auto' }} value={newDetails} onChange={e => setNewDetails(e.target.value)} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn-primary" style={{ flex: 1 }} onClick={handleUploadSubmit} disabled={isUploading}>{isUploading ? 'جاري الرفع...' : 'حفظ ونشر'}</button>
                                        <button className="btn-outline" style={{ flex: 1 }} onClick={() => setTempImage(null)}>إلغاء</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'var(--bg-color)', padding: '3rem', borderRadius: '1.5rem', border: '1px solid var(--accent)', marginBottom: '4rem', boxShadow: 'var(--card-shadow)' }}>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>إصافة مقارنة "قبل وبعد"</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>صورة "قبل"</label>
                                <div style={{ height: '150px', border: '2px dashed #ccc', borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => document.getElementById('beforeInput')?.click()}>
                                    {baBefore ? <img src={baBefore} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Plus size={30} color="#ccc" />}
                                </div>
                                <input type="file" id="beforeInput" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleBAFileSelect(e, 'before')} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>صورة "بعد"</label>
                                <div style={{ height: '150px', border: '2px dashed #ccc', borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => document.getElementById('afterInput')?.click()}>
                                    {baAfter ? <img src={baAfter} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Plus size={30} color="#ccc" />}
                                </div>
                                <input type="file" id="afterInput" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleBAFileSelect(e, 'after')} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>العنوان</label>
                                <input type="text" className="btn-outline" style={{ width: '100%', textAlign: 'right', marginBottom: '1rem' }} value={baTitle} onChange={e => setBaTitle(e.target.value)} placeholder="مثلاً: تجديد مطبخ فيلا" />
                                <button className="btn-primary" style={{ width: '100%' }} onClick={handleBAUpload} disabled={baUploading || !baBefore || !baAfter}>
                                    {baUploading ? 'جاري الحفظ...' : 'حفظ المقارنة'}
                                </button>
                            </div>
                        </div>

                        {beforeAfterList.length > 0 && (
                            <div style={{ marginTop: '3rem' }}>
                                <h4 style={{ marginBottom: '1rem' }}>المقارنات الحالية</h4>
                                <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                    {currentBAItems.map(item => (
                                        <div key={item.id} style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #eee' }}>
                                            <div style={{ display: 'flex', height: '100px' }}>
                                                <img src={item.before_url} style={{ width: '50%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                                <img src={item.after_url} style={{ width: '50%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                            </div>
                                            <div style={{ padding: '0.5rem', fontSize: '0.8rem', textAlign: 'center' }}>{item.title}</div>
                                            <button onClick={() => handleDeleteBA(item.id)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px' }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                {totalBAPages > 1 && (
                                    <div className="pagination" style={{ marginTop: '2rem' }}>
                                        <button className="pagination-btn" onClick={() => setCurrentBAPage(prev => Math.max(prev - 1, 1))} disabled={currentBAPage === 1}>السابق</button>
                                        {[...Array(totalBAPages)].map((_, i) => (
                                            <button key={i} className={`pagination-btn ${currentBAPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentBAPage(i + 1)}>{i + 1}</button>
                                        ))}
                                        <button className="pagination-btn" onClick={() => setCurrentBAPage(prev => Math.min(prev + 1, totalBAPages))} disabled={currentBAPage === totalBAPages}>التالي</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                             <input 
                                type="text" 
                                placeholder="بحث بالعنوان..." 
                                className="btn-outline" 
                                style={{ width: '100%', textAlign: 'right', padding: '0.8rem 1.5rem', borderRadius: '1rem' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                             />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['all', 'kitchen', 'cabinet', 'office', 'laundry'].map((cat) => (
                                <button
                                    key={cat}
                                    className={adminFilter === cat ? 'btn-primary' : 'btn-outline'}
                                    style={{ padding: '0.5rem 1.2rem', borderRadius: '0.8rem', fontSize: '0.9rem' }}
                                    onClick={() => setAdminFilter(cat as any)}
                                >
                                    {cat === 'all' ? 'الكل' : 
                                     cat === 'kitchen' ? 'مطابخ' : 
                                     cat === 'cabinet' ? 'خزائن' : 
                                     cat === 'office' ? 'مكاتب' : 'حمامات'}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="gallery-grid">
                        {filteredGallery.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                            <div key={item.id} className="gallery-item-admin" style={{
                                background: 'var(--bg-color)',
                                padding: '1rem',
                                borderRadius: '1.5rem',
                                border: '1px solid var(--glass-border)',
                                boxShadow: 'var(--card-shadow)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => startEditing(item)}
                                            style={{ background: '#3b82f6', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            style={{ background: '#ef4444', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', textAlign: 'right' }}>
                                    {editingId === item.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            <input 
                                                type="text" 
                                                className="btn-outline" 
                                                style={{ width: '100%', textAlign: 'right', padding: '0.5rem' }} 
                                                value={editTitle} 
                                                onChange={e => setEditTitle(e.target.value)} 
                                            />
                                            <select 
                                                className="btn-outline" 
                                                style={{ width: '100%', textAlign: 'right', padding: '0.5rem', background: 'transparent' }} 
                                                value={editCategory} 
                                                onChange={e => setEditCategory(e.target.value as any)}
                                            >
                                                <option value="kitchen">مطبخ</option>
                                                <option value="cabinet">خزانة ملابس</option>
                                                <option value="office">مكاتب</option>
                                                <option value="laundry">غرف غسيل وحمامات</option>
                                            </select>
                                            <textarea 
                                                className="btn-outline" 
                                                style={{ width: '100%', textAlign: 'right', padding: '0.5rem', height: '60px' }} 
                                                value={editDetails} 
                                                onChange={e => setEditDetails(e.target.value)} 
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button className="btn-primary" style={{ padding: '0.5rem 1rem', flex: 1 }} onClick={() => handleUpdate(item.id)}>
                                                    <Save size={16} /> حفظ
                                                </button>
                                                <button className="btn-outline" style={{ padding: '0.5rem 1rem', flex: 1 }} onClick={() => setEditingId(null)}>
                                                    إلغاء
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>{item.title}</h4>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '700' }}>
                                                {item.category === 'cabinet' ? 'خزانة ملابس' : 
                                                 item.category === 'office' ? 'مكاتب' : 
                                                 item.category === 'laundry' ? 'غرف غسيل وحمامات' : 'مطبخ'}
                                            </span>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {item.details || 'لا توجد تفاصيل.'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination for Admin */}
                    {totalPages > 1 && (
                        <div className="pagination" style={{ marginTop: '3rem', marginBottom: '4rem' }}>
                            <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>السابق</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            ))}
                            <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>التالي</button>
                        </div>
                    )}
                </section>
            </main>

            {selectedImage && (
                <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)}>
                    <button className="lightbox-close" onClick={() => setSelectedImage(null)}><X size={24} /></button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img src={selectedImage.url} className="lightbox-image" alt="Preview" />
                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ color: 'var(--accent)', fontSize: '1.8rem', marginBottom: '1rem' }}>{selectedImage.title}</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>{selectedImage.details || 'لا توجد تفاصيل.'}</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
