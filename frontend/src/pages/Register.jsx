import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = ({ toast }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      if (err.response?.data?.errors) {
        const apiErrs = {};
        err.response.data.errors.forEach(e => { apiErrs[e.path] = e.msg; });
        setErrors(apiErrs);
      } else {
        setErrors({ general: msg });
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-mark">T</div>
          <span className="logo-text">TaskFlow</span>
        </div>
        <h1 className="auth-heading">Create account</h1>
        <p className="auth-subheading">Join TaskFlow and start managing your tasks.</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" value={form.name} onChange={handle} className="form-input" placeholder="John Doe" required autoFocus />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} className="form-input" placeholder="you@example.com" required />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} className="form-input" placeholder="Min. 6 characters" required />
            {errors.password && <p className="error-msg">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select name="role" value={form.role} onChange={handle} className="form-input form-select">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {errors.general && <p className="error-msg" style={{ marginBottom: 14 }}>{errors.general}</p>}
          <button className="btn btn-primary" style={{ width: '100%', padding: '13px' }} disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
