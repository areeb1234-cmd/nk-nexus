import React, { useState } from 'react';
import { X, Lock, Mail, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, handleDummyAuth } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDummyAuth(email || 'explorer@freshfind.green', name || 'Market Explorer');
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-forest)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Lock size={16} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-darkest)' }}>
              {authMode === 'login' ? 'Welcome Back' : 'Create Explorer Account'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            style={{ color: 'var(--text-muted)', padding: 4 }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '8px 12px', background: 'var(--color-mint-tint)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--color-forest-dark)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckCircle2 size={14} style={{ color: 'var(--color-leaf)' }} />
          <span>Aptech / TechWiz Demo Interface · Simulated Session Only</span>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px 0',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: authMode === 'login' ? 'var(--color-forest)' : 'var(--text-muted)',
              borderBottom: authMode === 'login' ? '2px solid var(--color-leaf)' : '2px solid transparent'
            }}
            onClick={() => setAuthMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px 0',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: authMode === 'signup' ? 'var(--color-forest)' : 'var(--text-muted)',
              borderBottom: authMode === 'signup' ? '2px solid var(--color-leaf)' : '2px solid transparent'
            }}
            onClick={() => setAuthMode('signup')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {authMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    height: 42,
                    padding: '0 12px 0 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    outline: 'none',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 12px 0 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 12px 0 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            {authMode === 'login' ? 'Sign In to Demo Profile' : 'Start FreshFind Journey'}
          </button>
        </form>
      </div>
    </div>
  );
}
