import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ username, isAdmin }) => {
    const [showAbout, setShowAbout] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <span className="navbar-logo">🚌</span>
                    <span className="navbar-title">Kerala Bus Finder</span>
                </div>

                <div className="navbar-menu">
                    <button className="navbar-link" onClick={() => setShowAbout(true)}>
                        About
                    </button>

                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={`Switch to ${theme === 'purple' ? 'Dark' : 'Purple'} theme`}
                    >
                        <div className={`toggle-slider-inline ${theme}`}>
                            <span className="toggle-icon-inline">
                                {theme === 'purple' ? '🌙' : '🔥'}
                            </span>
                        </div>
                    </button>

                    <button className="navbar-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* About Modal */}
            {showAbout && (
                <div className="modal-overlay" onClick={() => setShowAbout(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowAbout(false)}>
                            ✕
                        </button>
                        <h2>About Kerala Bus Finder</h2>
                        <div className="modal-body">
                            <p>
                                This site is used to find buses available in users route.
                                This project was developed by <strong>ShyamPrasad</strong>, <strong>Sooraj</strong>,
                                <strong> Vishnu</strong>, and <strong>Yasas</strong> as part of their mini project.
                            </p>
                            <p>
                                It is mainly focused to reduce the struggles faced by public to reach
                                their destination without any delay.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
