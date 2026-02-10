import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'purple' ? 'Dark' : 'Purple'} theme`}
        >
            <div className={`toggle-slider ${theme}`}>
                <span className="toggle-icon">
                    {theme === 'purple' ? '🌙' : '🔥'}
                </span>
            </div>
        </button>
    );
};

export default ThemeToggle;
