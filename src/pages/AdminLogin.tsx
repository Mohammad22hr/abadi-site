import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Login failed');
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '100px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2.5rem 1.5rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', background: 'var(--bg-light)', boxShadow: 'var(--card-shadow)' }}>
        <div className="section-title" style={{ marginBottom: '2rem' }}>
          <div className="badge">لوحة التحكم</div>
          <h2 style={{ marginTop: '1rem' }}>تسجيل دخول الإدارة</h2>
          <p style={{ marginTop: '0.5rem' }}>يرجى إدخال بيانات الدخول لتعديل محتوى الموقع.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>اسم المستخدم</label>
            <input
              className="btn-outline"
              style={{ width: '100%', textAlign: 'right', borderRadius: '1rem' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>كلمة المرور</label>
            <input
              type="password"
              className="btn-outline"
              style={{ width: '100%', textAlign: 'right', borderRadius: '1rem' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>
              {error}
            </div>
          )}

          <button className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              العودة للموقع
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

