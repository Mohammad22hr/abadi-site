import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="footer" style={{ padding: '1rem 0' }}>
            <p className="copyright" style={{ margin: 0, textAlign: 'center', fontSize: '0.85rem', opacity: 0.8 }}>
                {t('footer.copyright')}
            </p>
        </footer>
    );
}
