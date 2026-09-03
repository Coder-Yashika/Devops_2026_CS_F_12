import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import api from '../api/client';

const initialState = {
  fullName: '',
  facultyId: '',
  email: '',
  department: '',
  designation: '',
  mobileNumber: '',
  password: '',
};

export default function RegisterFaculty() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register/faculty', form);
      // Faculty accounts don't require OTP in this design - send straight to login.
      navigate('/login', { state: { message: 'Registration successful. You can now log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Faculty Registration" subtitle="Use your official College ID">
      <form onSubmit={handleSubmit}>
        <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
        <FormField label="Faculty ID" name="facultyId" value={form.facultyId} onChange={handleChange} required />
        <FormField label="College Email" type="email" name="email" value={form.email} onChange={handleChange} required />
        <FormField label="Department" name="department" value={form.department} onChange={handleChange} required />
        <FormField label="Designation" name="designation" value={form.designation} onChange={handleChange} required />
        <FormField label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
        <FormField label="Password" type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />

        {error && <p className="mb-4 text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-brand-600)' }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        Already registered?{' '}
        <Link to="/login" className="font-medium" style={{ color: 'var(--color-brand-600)' }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
