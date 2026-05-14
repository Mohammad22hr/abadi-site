const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();

const port = Number(process.env.PORT || 5050);
const isProduction = process.env.NODE_ENV === 'production';
const allowInsecureDefaults = process.env.ALLOW_INSECURE_DEFAULTS === 'true';
const maxImageDataUrlLength = Number(process.env.MAX_IMAGE_DATA_URL_LENGTH || 8000000);
const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'abadii_admin_session';

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const isLocalDevOrigin = (origin) =>
    /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes',
        status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: {
        message: 'Too many sensitive requests from this IP, please try again after an hour',
        status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use(
    helmet({
        crossOriginResourcePolicy: false,
        contentSecurityPolicy: false,
    })
);

app.use(compression());

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
                return callback(null, true);
            }

            return callback(new Error('CORS blocked for this origin'), false);
        },
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isLikelyDataUrl(value) {
    return typeof value === 'string' && value.startsWith('data:image/');
}

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'abadii_new_db',
    password: process.env.DB_PASSWORD || '1234',
    port: Number(process.env.DB_PORT || 5432),
});

pool.query(
    `
  CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    details TEXT,
    category VARCHAR(50) DEFAULT 'kitchen',
    is_custom BOOLEAN DEFAULT true,
    type VARCHAR(50) DEFAULT 'gallery',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,
    (err) => {
        if (err) {
            console.error('Error creating gallery table:', err.stack || err.message);
            return;
        }

        console.log('PostgreSQL Database connected & gallery table ready!');

        pool
            .query("ALTER TABLE gallery ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'kitchen'")
            .catch((e) => console.error('Error ensuring gallery.category:', e.message));

        pool
            .query("ALTER TABLE gallery ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'gallery'")
            .catch((e) => console.error('Error ensuring gallery.type:', e.message));

        pool
            .query('ALTER TABLE gallery ADD COLUMN IF NOT EXISTS details TEXT')
            .catch((e) => console.error('Error ensuring gallery.details:', e.message));

        pool.query(
            `
      CREATE TABLE IF NOT EXISTS before_after (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        before_url TEXT NOT NULL,
        after_url TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,
            (err) => {
                if (err) console.error('Error creating before_after table:', err.stack || err.message);
                else console.log('before_after table ready!');
            }
        );
    }
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || (allowInsecureDefaults ? 'admin' : '');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (allowInsecureDefaults ? 'admin123' : '');
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || (allowInsecureDefaults ? 'dev_admin_secret_change_me' : '');

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_JWT_SECRET) {
    const errorMessage = '[admin] Missing ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_JWT_SECRET in env.';

    if (isProduction || !allowInsecureDefaults) {
        throw new Error(`${errorMessage} Set ALLOW_INSECURE_DEFAULTS=true only for local fallback.`);
    }
}

function signAdminToken(username) {
    return jwt.sign({ sub: username, role: 'admin' }, ADMIN_JWT_SECRET, {
        expiresIn: '7d',
    });
}

function authenticateAdmin(req, res, next) {
    const auth = req.headers.authorization || '';
    const [scheme, bearerToken] = auth.split(' ');
    const cookieToken = req.cookies ? req.cookies[ADMIN_COOKIE_NAME] : undefined;
    const token = cookieToken || (scheme === 'Bearer' ? bearerToken : null);

    if (!token) {
        return res.status(401).json({ error: 'Missing admin token' });
    }

    try {
        const payload = jwt.verify(token, ADMIN_JWT_SECRET);

        if (!payload || payload.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        req.admin = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

app.post('/api/admin/login', strictLimiter, (req, res) => {
    const { username, password } = req.body || {};

    if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = signAdminToken(username);

        res.cookie(ADMIN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        return res.json({ ok: true });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/admin/verify', authenticateAdmin, (req, res) => {
    return res.json({
        valid: true,
        user: (req.admin && req.admin.sub) || ADMIN_USERNAME,
    });
});

app.post('/api/admin/logout', (req, res) => {
    res.clearCookie(ADMIN_COOKIE_NAME, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
    });

    return res.json({ ok: true });
});

app.get('/api/ping', (req, res) => {
    return res.json({
        status: 'ok',
        time: new Date(),
    });
});

app.get('/api/gallery', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gallery ORDER BY id DESC');
        return res.json(result.rows);
    } catch (err) {
        console.error('Gallery fetch error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.post('/api/gallery', authenticateAdmin, strictLimiter, async(req, res) => {
    try {
        const {
            title,
            url,
            details,
            isCustom,
            type = 'gallery',
            category = 'kitchen',
        } = req.body;

        if (!isNonEmptyString(title) || !isLikelyDataUrl(url) || url.length > maxImageDataUrlLength) {
            return res.status(400).json({ error: 'Invalid gallery payload (title/url)' });
        }

        const newImage = await pool.query(
            'INSERT INTO gallery (title, url, details, is_custom, type, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [title, url, details, isCustom, type, category]
        );

        return res.json(newImage.rows[0]);
    } catch (err) {
        console.error('Gallery insert error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.put('/api/gallery/:id', authenticateAdmin, strictLimiter, async(req, res) => {
    try {
        const { id } = req.params;
        const { title, details, category } = req.body;

        const result = await pool.query(
            'UPDATE gallery SET title = $1, details = $2, category = $3 WHERE id = $4 RETURNING *', [title, details, category, id]
        );

        return res.json(result.rows[0]);
    } catch (err) {
        console.error('Gallery update error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.delete('/api/gallery/:id', authenticateAdmin, strictLimiter, async(req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM gallery WHERE id = $1', [id]);

        return res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error('Gallery delete error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.post('/api/system-image', authenticateAdmin, strictLimiter, async(req, res) => {
    try {
        const { type, url, title, details } = req.body;

        if (!isNonEmptyString(type) || !isLikelyDataUrl(url) || url.length > maxImageDataUrlLength) {
            return res.status(400).json({ error: 'Invalid system image payload' });
        }

        const exists = await pool.query('SELECT * FROM gallery WHERE type = $1', [type]);

        if (exists.rows.length > 0) {
            const updated = await pool.query(
                'UPDATE gallery SET url = $1, title = $2, details = $3 WHERE type = $4 RETURNING *', [url, title, details, type]
            );

            return res.json(updated.rows[0]);
        }

        const inserted = await pool.query(
            'INSERT INTO gallery (title, url, details, is_custom, type) VALUES ($1, $2, $3, false, $4) RETURNING *', [title, url, details, type]
        );

        return res.json(inserted.rows[0]);
    } catch (err) {
        console.error('System image error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.get('/api/before-after', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM before_after ORDER BY id DESC');
        return res.json(result.rows);
    } catch (err) {
        console.error('Before/after fetch error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.post('/api/before-after', authenticateAdmin, strictLimiter, async(req, res) => {
    try {
        const { title, before_url, after_url, description } = req.body;

        if (!isLikelyDataUrl(before_url) || !isLikelyDataUrl(after_url)) {
            return res.status(400).json({ error: 'Invalid before/after image payload' });
        }

        if (before_url.length > maxImageDataUrlLength || after_url.length > maxImageDataUrlLength) {
            return res.status(400).json({ error: 'Image is too large' });
        }

        const result = await pool.query(
            'INSERT INTO before_after (title, before_url, after_url, description) VALUES ($1, $2, $3, $4) RETURNING *', [title, before_url, after_url, description]
        );

        return res.json(result.rows[0]);
    } catch (err) {
        console.error('Before/after insert error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.delete('/api/before-after/:id', authenticateAdmin, strictLimiter, async(req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM before_after WHERE id = $1', [id]);

        return res.json({ message: 'Entry deleted' });
    } catch (err) {
        console.error('Before/after delete error:', err.message);
        return res.status(500).send('Server Error');
    }
});

app.post('/api/contact', async(req, res) => {
    const { name, phone, service, message } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(phone)) {
        return res.status(400).json({ error: 'Name and phone are required' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-password',
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: process.env.CONTACT_TO_EMAIL || 'fadelfadel2211@gmail.com',
        subject: `طلب جديد من الموقع: ${name}`,
        text: `
لديك طلب جديد من الموقع:

الاسم: ${name}
رقم الجوال: ${phone}
الخدمة المطلوبة: ${service || '-'}
الرسالة: ${message || '-'}
`,
    };

    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            return res.json({ message: 'تم إرسال الطلب بنجاح!' });
        }

        console.log('SMTP Credentials missing, logging mail content to console:');
        console.log(mailOptions.text);

        return res.json({
            message: 'تم استلام الطلب (بيانات البريد غير مهيئة للسيرفر)',
        });
    } catch (err) {
        console.error('Email error:', err);
        return res.status(500).json({ error: 'Failed to send email' });
    }
});

// Frontend static serving
// Frontend static serving
const distPath = path.join(__dirname, '..', 'dist');
const assetsPath = path.join(distPath, 'assets');
const indexPath = path.join(distPath, 'index.html');

console.log('--- Frontend static debug ---');
console.log('distPath:', distPath);
console.log('dist exists:', fs.existsSync(distPath));
console.log('index exists:', fs.existsSync(indexPath));
console.log('assetsPath:', assetsPath);
console.log('assets exists:', fs.existsSync(assetsPath));

if (fs.existsSync(assetsPath)) {
    console.log('assets files:', fs.readdirSync(assetsPath));
}

if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
    console.log(`Serving frontend from: ${distPath}`);

    app.use(
        '/assets',
        express.static(assetsPath, {
            index: false,
            fallthrough: false,
            setHeaders(res, filePath) {
                if (filePath.endsWith('.js')) {
                    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                }

                if (filePath.endsWith('.css')) {
                    res.setHeader('Content-Type', 'text/css; charset=utf-8');
                }
            },
        })
    );

    app.use(
        express.static(distPath, {
            index: false,
            fallthrough: true,
        })
    );

    app.get(/^(?!\/api).*/, (req, res) => {
        return res.sendFile(indexPath);
    });
} else {
    console.warn(`Frontend dist not found at: ${distPath}`);
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});