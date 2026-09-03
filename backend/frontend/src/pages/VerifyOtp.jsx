import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import api from '../api/client';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setSuccess('Email verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code sent to your college email">
      <form onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          label="Verification Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        {error && <p className="mb-4 text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}
        {success && <p className="mb-4 text-sm" style={{ color: 'var(--color-success)' }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-brand-600)' }}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </AuthLayout>
  );
}
