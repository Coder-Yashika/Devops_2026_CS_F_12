import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import api from '../api/client';

const initialState = {
  fullName: '',
  enrollmentNumber: '',
  email: '',
  personalEmail: '',
  mobileNumber: '',
  department: '',
  course: '',
  year: '',
  semester: '',
  password: '',
};

export default function RegisterStudent() {
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
      await api.post('/auth/register/student', form);
      // OTP has been emailed - send them straight to verification, carrying
      // the email along via route state so they don't have to retype it.
navigate('/login');    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Student Registration" subtitle="Use your official college email">
      <form onSubmit={handleSubmit}>
        <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
        <FormField label="Enrollment Number" name="enrollmentNumber" value={form.enrollmentNumber} onChange={handleChange} required />
        <FormField label="College Email" type="email" name="email" value={form.email} onChange={handleChange} required />
        <FormField label="Personal Email (optional)" type="email" name="personalEmail" value={form.personalEmail} onChange={handleChange} />
        <FormField label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
        <FormField label="Department" name="department" value={form.department} onChange={handleChange} required />
        <FormField label="Course" name="course" value={form.course} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Year" type="number" name="year" min="1" max="6" value={form.year} onChange={handleChange} required />
          <FormField label="Semester" type="number" name="semester" min="1" max="12" value={form.semester} onChange={handleChange} required />
        </div>
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
