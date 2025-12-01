import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './SharedPages.css';

const Blog = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems } = useCart();

    const blogPosts = [
        {
            id: 1,
            title: '10 Must-Read Books of 2024',
            excerpt: 'Discover the most captivating books that have taken the literary world by storm this year...',
            author: 'Sarah Johnson',
            date: 'Nov 28, 2024',
            readTime: '5 min read',
            category: 'Recommendations',
            image: '/blog/blog1.jpg'
        },
        {
            id: 2,
            title: 'The Art of Building a Home Library',
            excerpt: 'Transform your space into a personal sanctuary with these expert tips on organizing your collection...',
            author: 'Michael Chen',
            date: 'Nov 25, 2024',
            readTime: '7 min read',
            category: 'Tips & Guides',
            image: '/blog/blog2.jpg'
        },
        {
            id: 3,
            title: 'Classic Literature: Why It Still Matters',
            excerpt: 'Exploring the timeless relevance of classic novels in our modern world and their impact on contemporary writing...',
            author: 'Emma Thompson',
            date: 'Nov 20, 2024',
            readTime: '6 min read',
            category: 'Literary Analysis',
            image: '/blog/blog3.jpg'
        },
        {
            id: 4,
            title: 'Interview with Bestselling Author Jane Doe',
            excerpt: 'An exclusive conversation about her latest novel, creative process, and advice for aspiring writers...',
            author: 'Library Lite Team',
            date: 'Nov 15, 2024',
            readTime: '10 min read',
            category: 'Interviews',
            image: '/blog/blog4.jpg'
        },
        {
            id: 5,
            title: 'Reading Habits That Changed My Life',
            excerpt: 'Personal stories from avid readers about how consistent reading transformed their perspectives and daily routines...',
            author: 'David Martinez',
            date: 'Nov 10, 2024',
            readTime: '8 min read',
            category: 'Personal Stories',
            image: '/blog/blog5.jpg'
        },
        {
            id: 6,
            title: 'The Rise of Digital Reading',
            excerpt: 'Examining the evolution of e-books and how technology is shaping the future of reading experiences...',
            author: 'Tech Review Team',
            date: 'Nov 5, 2024',
            readTime: '6 min read',
            category: 'Technology',
            image: '/blog/blog6.jpg'
        }
    ];

    const categories = ['All', 'Recommendations', 'Tips & Guides', 'Literary Analysis', 'Interviews', 'Personal Stories', 'Technology'];

    return (
        <div className="shared-page">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">Library Lite</Link>
                    <nav className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/about">About us</Link>
                        <Link to="/blog" className="active">Blog</Link>
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
                    <h1>Our Blog</h1>
                    <p>Stories, insights, and updates from the world of books</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="content-section">
                <div className="container">
                    {/* Category Filter */}
                    <div className="blog-categories">
                        {categories.map((category, index) => (
                            <button key={index} className={index === 0 ? 'category-btn active' : 'category-btn'}>
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Featured Post */}
                    <div className="featured-post">
                        <div className="featured-post-image">
                            <img src={blogPosts[0].image} alt={blogPosts[0].title} />
                            <span className="post-category">{blogPosts[0].category}</span>
                        </div>
                        <div className="featured-post-content">
                            <h2>{blogPosts[0].title}</h2>
                            <div className="post-meta">
                                <span><FiCalendar size={16} /> {blogPosts[0].date}</span>
                                <span><FiClock size={16} /> {blogPosts[0].readTime}</span>
                            </div>
                            <p>{blogPosts[0].excerpt}</p>
                            <button className="read-more-btn">
                                Read More <FiArrowRight />
                            </button>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="blog-grid">
                        {blogPosts.slice(1).map((post) => (
                            <article key={post.id} className="blog-card">
                                <div className="blog-card-image">
                                    <img src={post.image} alt={post.title} />
                                    <span className="post-category">{post.category}</span>
                                </div>
                                <div className="blog-card-content">
                                    <h3>{post.title}</h3>
                                    <div className="post-meta">
                                        <span><FiCalendar size={14} /> {post.date}</span>
                                        <span><FiClock size={14} /> {post.readTime}</span>
                                    </div>
                                    <p>{post.excerpt}</p>
                                    <button className="read-more-btn">
                                        Read More <FiArrowRight />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Newsletter Signup */}
                    <div className="newsletter-section">
                        <h2>Subscribe to Our Newsletter</h2>
                        <p>Get the latest book recommendations, reviews, and literary insights delivered to your inbox</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your email address" />
                            <button type="button">Subscribe</button>
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

export default Blog;
