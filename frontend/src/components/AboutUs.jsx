import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiBookOpen, FiUsers, FiAward, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './SharedPages.css';

const AboutUs = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems } = useCart();

    return (
        <div className="shared-page">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">Library Lite</Link>
                    <nav className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/about" className="active">About us</Link>
                        <Link to="/blog">Blog</Link>
                    </nav>
                    <div className="header-actions">
                        <button type="button" className="search-btn" aria-label="Search">
                            <FiSearch size={20} />
                        </button>
                        <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
                            <FiShoppingCart size={20} />
                            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                        </Link>
                        {user ? (
                            <button
                                type="button"
                                className="dashboard-btn"
                                onClick={() => navigate('/dashboard')}
                            >
                                <FiUser size={18} />
                                <span>Dashboard</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="login-btn"
                                onClick={() => navigate('/auth')}
                            >
                                <FiUser size={18} />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="page-hero">
                <div className="container">
                    <h1>About Library Lite</h1>
                    <p>Discover the story behind your favorite online bookstore</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="content-section">
                <div className="container">
                    <div className="about-intro">
                        <div className="about-text">
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2020, Library Lite emerged from a simple belief: everyone deserves access
                                to great books. What started as a small collection has grown into a comprehensive
                                digital library serving thousands of readers worldwide.
                            </p>
                            <p>
                                We're passionate about connecting readers with stories that matter. Our carefully
                                curated selection spans genres, languages, and cultures, ensuring there's something
                                for every reader on their unique literary journey.
                            </p>
                        </div>
                        <div className="about-image">
                            <img src="/about-hero.jpg" alt="Library" />
                        </div>
                    </div>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <FiBookOpen size={40} />
                            </div>
                            <h3>Vast Collection</h3>
                            <p>Over 10,000 titles across all genres, from timeless classics to contemporary bestsellers</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <FiUsers size={40} />
                            </div>
                            <h3>Community Driven</h3>
                            <p>Join a thriving community of book lovers sharing reviews, recommendations, and insights</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <FiAward size={40} />
                            </div>
                            <h3>Quality Assured</h3>
                            <p>Every book is carefully selected and verified for authenticity and condition</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <FiHeart size={40} />
                            </div>
                            <h3>Reader First</h3>
                            <p>Our customer-centric approach ensures the best reading experience for everyone</p>
                        </div>
                    </div>

                    <div className="mission-section">
                        <h2>Our Mission</h2>
                        <p>
                            At Library Lite, we believe in the transformative power of reading. Our mission is to
                            make quality literature accessible to everyone, fostering a love for books that transcends
                            borders and generations. We're committed to:
                        </p>
                        <ul>
                            <li>Providing exceptional customer service and support</li>
                            <li>Offering competitive prices without compromising quality</li>
                            <li>Supporting authors and publishers worldwide</li>
                            <li>Promoting literacy and education through our programs</li>
                            <li>Creating a sustainable and eco-friendly book ecosystem</li>
                        </ul>
                    </div>

                    <div className="stats-section">
                        <div className="stat-item">
                            <h3>10,000+</h3>
                            <p>Books Available</p>
                        </div>
                        <div className="stat-item">
                            <h3>50,000+</h3>
                            <p>Happy Readers</p>
                        </div>
                        <div className="stat-item">
                            <h3>100+</h3>
                            <p>Countries Served</p>
                        </div>
                        <div className="stat-item">
                            <h3>4.8/5</h3>
                            <p>Customer Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>Library Lite</h3>
                            <p>Your trusted source for quality books and exceptional reading experiences.</p>
                        </div>
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <Link to="/">Home</Link>
                            <Link to="/shop">Shop</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/blog">Blog</Link>
                        </div>
                        <div className="footer-section">
                            <h4>Customer Service</h4>
                            <a href="#contact">Contact Us</a>
                            <a href="#faq">FAQ</a>
                            <a href="#shipping">Shipping Info</a>
                            <a href="#returns">Returns</a>
                        </div>
                        <div className="footer-section">
                            <h4>Follow Us</h4>
                            <a href="#facebook">Facebook</a>
                            <a href="#twitter">Twitter</a>
                            <a href="#instagram">Instagram</a>
                            <a href="#linkedin">LinkedIn</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Library Lite. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;
