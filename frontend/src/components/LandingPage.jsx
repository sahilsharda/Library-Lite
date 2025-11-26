import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  // const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (book) => {
    setCart([...cart, book]);
    alert(`${book.title} added to cart!`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert("Searching for: " + searchQuery);
  };

  const featuredBooks = [
    {
      id: 1,
      title: 'All Of Twenty Nine',
      author: 'Ancy Johny',
      price: 65.99,
      rating: 4,
      image: 'fb/pb1.jpg',
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      price: 45.99,
      rating: 5,
      image: 'fb/pb2.jpeg',
    },
    {
      id: 3,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      price: 55.99,
      rating: 4,
      image: 'fb/pb3.jpg',
    },
    {
      id: 4,
      title: 'The Catcher in the Rye',
      author: 'J. D. Salinger',
      price: 55.99,
      rating: 4,
      image: 'fb/pb4.jpeg',
    },
    
  ];

  const bestCollection = [
    {
      id: 4,
      title: 'The City of Brass',
      author: 'S.A. Chakraborty',
      price: 85.99,
      rating: 5,
      image: 'bc/bc1.jpg',
    },
    {
      id: 5,
      title: 'Harry Potter',
      author: 'J.K Rowling',
      price: 55.99,
      rating: 4,
      image: 'bc/bc2.jpg',
    },
    {
      id: 6,
      title: 'I Am Number Four',
      author: 'Pittacus Lore',
      price: 85.99,
      rating: 4,
      image: 'bc/bc3.jpg',
    },
    {
      id: 7,
      title: 'The 100',
      author: 'Kass Morgan',
      price: 95.99,
      rating: 5,
      image: 'bc/bc4.jpg',
    },
  ];

  const bestSelling = [
    {
      id: 8,
      title: 'A Tale of Two Cities',
      author: 'Charles Dickens',
      price: 85.99,
      rating: 4,
      image: 'bs/bs1.jpg',
    },
    {
      id: 9,
      title: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      price: 85.99,
      rating: 4,
      image: 'bs/bs2.jpeg',
    },
    {
      id: 10,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      price: 85.99,
      rating: 4,
      image: 'bs/bs3.jpg',
    },
    {
      id: 11,
      title: 'And Then There Were None',
      author: 'Agatha Christie',
      price: 85.99,
      rating: 5,
      image: 'bs/bs4.jpg',
    },
  ];

  const newArrivals = [
    {
      id: 12,
      title: 'Great Big Beautiful Life',
      author: 'Emily Henry',
      price: 72.99,
      rating: 5,
      image: 'na/na1.jpg',
    },
    {
      id: 13,
      title: 'In Your Dreams',
      author: 'Sarah Adams',
      price: 68.99,
      rating: 5,
      image: 'na/na2.jpg',
    },
    {
      id: 14,
      title: 'Brimstone',
      author: 'Callie Hart',
      price: 78.99,
      rating: 4,
      image: 'na/na3.jpg',
    },
    {
      id: 15,
      title: 'Watch Me',
      author: 'Tahereh Mafi',
      price: 82.99,
      rating: 5,
      image: 'na/na4.jpg',
    },
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">BestBook.com</Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About us</Link>
            <Link to="/blog">Blog</Link>
          </nav>
          <div className="header-actions">
            <form onSubmit={handleSearch} className="header-search">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search-input"
              />
              <button type="submit" className="header-search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
            <Link to="/cart" className="cart-btn">
              🛒 {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>
            <button className="user-btn">👤</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Experience our New Exclusive Books</h1>
              <p>
                Dive into a curated collection of timeless classics, contemporary bestsellers, 
                and hidden literary gems. Whether you're seeking knowledge, adventure, or 
                inspiration, our exclusive selection brings the world's finest literature 
                right to your doorstep. Discover stories that transform, educate, and 
                captivate readers of all ages.
              </p>
              <Link to="/shop" className="cta-button">Shop Now →</Link>
            </div>
            <div className="hero-video">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="hero-video-element"
              >
                <source src="/library_bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>Certified</h3>
            <p>Exclusive certificate of authenticity</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">↩️</span>
            <h3>Returns</h3>
            <p>Return available within 30 days</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🚚</span>
            <h3>Free Shipping</h3>
            <p>Free shipping on orders over $50</p>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="popular-books">
        <div className="container">
          <div className="section-header">
            <h2>Our Popular Books</h2>
            <Link to="/shop" className="see-all">See all →</Link>
          </div>
          <div className="books-grid">
            {featuredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image">
                  <img src={book.image} alt={book.title} />
                </div>
                <h3>{book.title}</h3>
                <p className="author">By {book.author}</p>
                <div className="book-footer">
                  <div className="rating">
                    {'⭐'.repeat(book.rating)}
                    <span>{book.rating} Star</span>
                  </div>
                  <p className="price">${book.price}</p>
                </div>
                <button 
                  className="add-cart-btn"
                  onClick={() => addToCart(book)}
                >
                  ADD TO CART →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Collection Section */}
      <section className="best-collection">
        <div className="container">
          <div className="section-header">
            <h2>Best Collection</h2>
            <Link to="/shop" className="see-all">See all →</Link>
          </div>
          <div className="books-grid-4">
            {bestCollection.map((book) => (
              <div key={book.id} className="book-card-small">
                <div className="book-image-small">
                  <img src={book.image} alt={book.title} />
                </div>
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p className="author-small">{book.author}</p>
                  <div className="rating-small">
                    {'⭐'.repeat(book.rating)}
                  </div>
                  <div className="price-action">
                    <span className="price">${book.price}</span>
                    <button 
                      className="quick-add"
                      onClick={() => addToCart(book)}
                    >
                      ADD TO CART →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Books */}
      <section className="best-selling">
        <div className="container">
          <div className="section-header">
            <h2>Our Best Selling Books</h2>
            <Link to="/shop" className="see-all">See all →</Link>
          </div>
          <div className="books-grid-4">
            {bestSelling.map((book) => (
             <div key={book.id} className="book-card-vertical">
              <div className="book-cover">
                <img src={book.image} alt={book.title} />
              </div>
              <h4>{book.title}</h4>
              <div className="book-meta-inline">
                <span className="author-inline">{book.author}</span>
                <div className="rating-inline">
                  {'⭐'.repeat(book.rating)}
                </div>
              </div>
              <div className="book-bottom">
                <span className="price">${book.price}</span>
                <button 
                  className="add-btn"
                  onClick={() => addToCart(book)}
                >
                  ADD TO CART →
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="new-arrivals">
        <div className="container">
          <div className="section-header">
            <h2>New Arrivals</h2>
            <Link to="/shop" className="see-all">See all →</Link>
          </div>
          <div className="books-grid-4">
            {newArrivals.map((book) => (
              <div key={book.id} className="book-card-vertical">
                <div className="book-cover">
                  <img src={book.image} alt={book.title} />
                </div>
                <h4>{book.title}</h4>
                <div className="book-meta-inline">
                  <span className="author-inline">{book.author}</span>
                  <div className="rating-inline">
                    {'⭐'.repeat(book.rating)}
                  </div>
                </div>
                <div className="book-bottom">
                  <span className="price">${book.price}</span>
                  <button 
                    className="add-btn"
                    onClick={() => addToCart(book)}
                  >
                    ADD TO CART →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SHOP WITH US</h3>
              <ul>
                <li><Link to="/books">All Books</Link></li>
                <li><Link to="/bestsellers">Bestsellers</Link></li>
                <li><Link to="/new">New Arrivals</Link></li>
                <li><Link to="/ebooks">eBooks</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>SHOP POPULAR</h3>
              <ul>
                <li><Link to="/fiction">Fiction</Link></li>
                <li><Link to="/nonfiction">Non-Fiction</Link></li>
                <li><Link to="/children">Children's Books</Link></li>
                <li><Link to="/textbooks">Textbooks</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>ABOUT</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>HELP</h3>
              <ul>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 BestBook.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;