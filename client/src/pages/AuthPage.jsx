import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
    const { login, register } = useAuth();
    const [mode, setMode] = useState('login');   // 'login' | 'register'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.bg}>
            {/* Decorative blobs */}
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                {/* Logo / Brand */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={styles.logo}>⚡</div>
                    <h1 style={styles.brand}>SmartFlow</h1>
                    <p style={styles.tagline}>Intelligent Task Management</p>
                </div>

                {/* Tab switcher */}
                <div style={styles.tabs}>
                    <button
                        id="tab-login"
                        style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        id="tab-register"
                        style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
                        onClick={() => { setMode('register'); setError(''); }}
                    >
                        Create Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {mode === 'register' && (
                        <div style={styles.field}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                id="input-name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                style={styles.input}
                                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    )}

                    <div style={styles.field}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            id="input-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={styles.input}
                            onFocus={e => e.target.style.borderColor = '#7c3aed'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            id="input-password"
                            type="password"
                            placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={styles.input}
                            onFocus={e => e.target.style.borderColor = '#7c3aed'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    {error && (
                        <div style={styles.errorBox}>{error}</div>
                    )}

                    <button
                        id="btn-submit-auth"
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnDisabled : {}) }}
                    >
                        {loading
                            ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
                            : (mode === 'login' ? 'Sign In →' : 'Create Account →')
                        }
                    </button>
                </form>

                <p style={styles.switchText}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span
                        style={styles.switchLink}
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                    >
                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </span>
                </p>
            </div>

            {/* Inline spinner animation */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin:0; font-family:'Inter',sans-serif; }
      `}</style>
        </div>
    );
}

const styles = {
    bg: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #060b18 0%, #0d1224 50%, #060b18 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
    },
    blob1: {
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    card: {
        background: 'rgba(15,20,40,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 1,
    },
    logo: {
        fontSize: 40,
        marginBottom: 8,
    },
    brand: {
        margin: '0 0 4px',
        fontSize: '1.8rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    tagline: {
        margin: 0,
        color: '#8892b0',
        fontSize: '0.85rem',
    },
    tabs: {
        display: 'flex',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.05)',
        padding: 4,
        marginBottom: 24,
        gap: 4,
    },
    tab: {
        flex: 1,
        padding: '9px 0',
        border: 'none',
        borderRadius: 8,
        background: 'transparent',
        color: '#8892b0',
        fontSize: '0.88rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: "'Inter', sans-serif",
    },
    tabActive: {
        background: 'rgba(124,58,237,0.25)',
        color: '#a78bfa',
        fontWeight: 600,
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    label: {
        color: '#a8b2d8',
        fontSize: '0.82rem',
        fontWeight: 500,
    },
    input: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '11px 14px',
        color: '#e2e8f0',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: "'Inter', sans-serif",
    },
    errorBox: {
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 8,
        padding: '10px 14px',
        color: '#fca5a5',
        fontSize: '0.85rem',
    },
    submitBtn: {
        marginTop: 4,
        padding: '13px',
        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        border: 'none',
        borderRadius: 10,
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        letterSpacing: '0.02em',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
    },
    submitBtnDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    switchText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#8892b0',
        fontSize: '0.85rem',
    },
    switchLink: {
        color: '#a78bfa',
        cursor: 'pointer',
        fontWeight: 600,
        textDecoration: 'underline',
        textUnderlineOffset: 2,
    },
};
