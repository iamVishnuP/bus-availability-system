import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/api';
import './LoginRegister.css';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = isLogin
                ? await login(formData)
                : await register(formData);

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('username', user.username);

            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>🚌 Kerala Bus System</h1>
                    <p>Real-time bus availability tracking</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginRegister;
