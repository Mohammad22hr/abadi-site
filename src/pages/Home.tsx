import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Ruler, Layers, Award, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/images/kitchen_hero.png';
import showcaseImg from '../assets/images/kitchen_details.png';

export default function Home() {
    return (
        <main>
            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="hero-content animate-fade-in delay-1">

                    <h1>نصنع لك <span>مطابخ وخزانات</span> الأحلام</h1>
                    <p>
                        "Abadi" هي منجرة متخصصة في تصميم وتنفيذ أرقى المطابخ الخشبية العصرية، بالإضافة لتجهيز الخزائن المودرن وغرف الملابس (Dressing Rooms) لنقدم لك مساحة تعكس ذوقك الرفيع.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/portfolio" className="btn-primary" style={{ textDecoration: 'none' }}>تصفح أعمالنا <ArrowLeft size={18} /></Link>

                    </div>
                </div>

                <div className="hero-visual animate-fade-in delay-2">
                    <img src={heroImg} alt="تصميم مطبخ حديث فاخر" className="hero-image" />
                </div>
            </section>

            {/* Features/Services Section */}
            <section id="services" className="features">
                <div className="section-title animate-fade-in delay-3">
                    <h2>لماذا تختار "Abadi"؟</h2>
                    <p>نحن لا نصنع مجرد مطابخ، بل نبتكر مساحات تلهمك كل يوم بفضل الجودة والإتقان.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Ruler size={28} />
                        </div>
                        <h3>مطابخ عصرية</h3>
                        <p>تصاميم إيطالية وألمانية حديثة، نستعمل أفضل أنواع الخشب المقاوم للرطوبة والحرارة مع إكسسوارات بلوم الأصلية.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Layers size={28} />
                        </div>
                        <h3>خزائن ذكية</h3>
                        <p>حلول تخزين مبتكرة للخزائن وغرف الملابس، استغلال مثالي لكل إنش في غرفتك مع تصاميم داخلية مخصصة.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Settings size={28} />
                        </div>
                        <h3>حرفية عالية</h3>
                        <p>فريق من أمهر النجارين والفنيين الذين يمتلكون خبرة واسعة في تنفيذ أعقد وأرقى التصاميم.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Award size={28} />
                        </div>
                        <h3>التزام بالمواعيد</h3>
                        <p>نحرص على تسليم مطبخك أو خزانتك في الوقت المحدد وبأعلى معايير الجودة والضمان.</p>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section id="about" className="showcase">
                <div className="showcase-content">
                    <div className="badge">تفاصيل تصنع الفارق</div>
                    <h2>الجمال يكمن في التفاصيل</h2>
                    <p>
                        في "Abadi"، نعير انتباهاً خاصاً للتشطيبات النهائية والحلول الذكية للتخزين التي تمنح منزلك طابعاً عصرياً وعملياً في الاستخدام اليومي.
                    </p>

                    <div className="list-item">
                        <CheckCircle2 size={24} className="list-icon" />
                        <div>
                            <h4>استغلال مثالي للمساحات</h4>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>تصاميم وتوزيعات مدروسة لتوفير راحة وسهولة أثناء الطبخ أو تنظيم الملابس.</p>
                        </div>
                    </div>

                    <div className="list-item">
                        <CheckCircle2 size={24} className="list-icon" />
                        <div>
                            <h4>إكسسوارات حديثة</h4>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>مقابض وأدراج ومفصلات مقاومة للصدأ من أفخم العلامات التجارية (Blum, Grass).</p>
                        </div>
                    </div>

                    <div className="list-item">
                        <CheckCircle2 size={24} className="list-icon" />
                        <div>
                            <h4>ضمان شامل</h4>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>نقدم ضماناً حقيقياً على الأخشاب والتجهيزات لنوفر لك راحة البال.</p>
                        </div>
                    </div>

                    <Link to="/portfolio" className="btn-primary" style={{ marginTop: "1rem", textDecoration: 'none' }}>استعرض أعمالنا <ArrowLeft size={18} /></Link>
                </div>

                <div className="showcase-image-container">
                    <img src={showcaseImg} alt="تفاصيل أثاث فاخر" className="showcase-image" />
                </div>
            </section>
        </main>
    );
}
