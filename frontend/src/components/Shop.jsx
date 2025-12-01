import React, { useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Shop.css';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const { cartItems, addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [searchQuery, setSearchQuery] = useState(search || '');

  // Refs for sliders
  const popularRef = useRef(null);
  const collectionRef = useRef(null);
  const bestsellingRef = useRef(null);
  const newRef = useRef(null);

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`✓ ${book.title} added to cart!`);
  };

  const handleProfileClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const allBooks = {
    popular: [
      {id: 1,title: 'All Of Twenty Nine',author: 'Ancy Johny',price: 65.99,rating: 4,image: 'fb/pb1.jpg'},
      {id: 2,title: 'To Kill a Mockingbird',author: 'Harper Lee',price: 45.99,rating: 5,image: 'fb/pb2.jpeg'},
      {id: 3,title: 'Pride and Prejudice',author: 'Jane Austen',price: 58.99,rating: 4,image: 'fb/pb3.jpg'},
      {id: 4,title: 'The Catcher in the Rye',author: 'J. D. Salinger',price: 55.99,rating: 4,image: 'fb/pb4.jpeg'},
      {id: 5,title: 'Atomic Habits',author: 'James Clear',price: 85.99,rating: 4.5,image: 'fb/pb5.jpg'},
      {id: 6,title: 'Moby-Dick',author: 'Herman Melville',price: 59.99,rating: 3.5,image: 'fb/pb6.jpeg'},
      {id: 7,title: 'The Hunger Games',author: 'Suzanne Collins',price: 65.99,rating: 4.2,image: 'fb/pb7.jpeg'},
      {id: 8,title: 'Fourth Wing',author: 'Rebecca Yarros',price: 75.99,rating: 5,image: 'fb/pb8.jpeg'},
    ],
    collection: [
      {id: 11,title: 'The City of Brass',author: 'S.A. Chakraborty',price: 85.99,rating: 5,image: 'bc/bc1.jpg'},
      {id: 12,title: 'Harry Potter',author: 'J.K Rowling',price: 55.99,rating: 4,image: 'bc/bc2.jpg'},
      {id: 13,title: 'I Am Number Four',author: 'Pittacus Lore',price: 85.99,rating: 4,image: 'bc/bc3.jpg'},
      {id: 14,title: 'The 100',author: 'Kass Morgan',price: 95.99,rating: 5,image: 'bc/bc4.jpg'},
      {id: 15,title: 'The Mirror Visitor',author: 'Christelle Dabos',price: 97.99,rating: 4.7,image: 'bc/bc5.jpg'},
      {id: 16,title: 'Inkworld Trilogy',author: 'Cornelia Funke',price: 75.99,rating: 4.5,image: 'bc/bc6.jpg'},
      {id: 17,title: 'Magyk and Flyte',author: 'Angie Sage',price: 78.99,rating: 4,image: 'bc/bc7.jpg'},
      {id: 18,title: "Man's Search For Meaning",author: 'Viktor E. Frankl',price: 90.99,rating: 5,image: 'bc/bc8.webp'},
    ],
    bestselling: [
      {id: 21,title: 'A Tale of Two Cities',author: 'Charles Dickens',price: 85.99,rating: 4,image: 'bs/bs1.jpg'},
      {id: 22,title: 'The Little Prince',author: 'Antoine de Saint-Exupéry',price: 65.99,rating: 4,image: 'bs/bs2.jpeg'},
      {id: 23,title: 'The Alchemist',author: 'Paulo Coelho',price: 75.99,rating: 4,image: 'bs/bs3.jpg'},
      {id: 24,title: 'And Then There Were None',author: 'Agatha Christie',price: 55.99,rating: 5,image: 'bs/bs4.jpg'},
      {id: 25,title: 'Black Beauty',author: 'Anna Sewell',price: 95.99,rating: 5,image: 'bs/bs5.jpeg'},
      {id: 26,title: 'The Kite Runner',author: 'Khaled Hosseini',price: 80.99,rating: 5,image: 'bs/bs6.jpg'},
      {id: 27,title: 'Me Before You',author: 'Jojo Moyes',price: 90.99,rating: 5,image: 'bs/bs7.jpg'},
      {id: 28,title: 'The Gruffalo',author: '	Julia Donaldson',price: 85.99,rating: 5,image: 'bs/bs8.jpg'},
    ],
    new: [
      {id: 31,title: 'Great Big Beautiful Life',author: 'Emily Henry',price: 72.99,rating: 5,image: 'na/na1.jpg'},
      {id: 32,title: 'In Your Dreams',author: 'Sarah Adams',price: 68.99,rating: 5,image: 'na/na2.jpg'},
      {id: 33,title: 'Brimstone',author: 'Callie Hart',price: 78.99,rating: 4,image: 'na/na3.jpg'},
      {id: 34,title: 'Watch Me',author: 'Tahereh Mafi',price: 82.99,rating: 5,image: 'na/na4.jpg'},
      {id: 35,title: 'And Now, Back to You',author: 'B.K. Borison',price: 95.99,rating: 5,image: 'na/na5.jpg'},
      {id: 36,title: 'Wild Reverence',author: 'Rebecca Ross',price: 80.99,rating: 4.5,image: 'na/na6.jpg'},
      {id: 37,title: 'Alchemised',author: 'SenLinYu',price: 90.99,rating: 4,image: 'na/na7.jpg'},
      {id: 38,title: 'Heartstopper',author: 'Alice Oseman',price: 75.99,rating: 5,image: 'na/na8.jpg'},
    ],
  };

  const getDisplayBooks = () => {
    if (selectedCategory === 'all') {
      return Object.values(allBooks).flat();
    }
    return allBooks[selectedCategory] || [];
  };

  const displayBooks = getDisplayBooks().filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shop-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">Library Lite</Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About us</Link>
            <Link to="/blog">Blog</Link>
          </nav>
          <div className="header-actions">
            <Link to="/cart" className="cart-btn">
              🛒 {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </Link>
            <button className="user-btn" onClick={handleProfileClick}>👤</button>
          </div>
        </div>
      </header>

      <div className="shop-container">
        <div className="container">
          {/* Shop Header */}
          <div className="shop-header">
            <h1>Book Store</h1>
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search"
            />
          </div>

          {/* Categories */}
          <div className="shop-categories">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Books
            </button>
            <button
              className={`category-btn ${selectedCategory === 'popular' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('popular')}
            >
              Popular
            </button>
            <button
              className={`category-btn ${selectedCategory === 'collection' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('collection')}
            >
              Best Collection
            </button>
            <button
              className={`category-btn ${selectedCategory === 'bestselling' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('bestselling')}
            >
              Best Selling
            </button>
            <button
              className={`category-btn ${selectedCategory === 'new' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('new')}
            >
              New Arrivals
            </button>
          </div>

          {/* Books Display */}
          {selectedCategory === 'all' ? (
            <>
              {/* Popular Section */}
              <div className="shop-category-section">
                <h2 className="category-section-title">Popular Books</h2>
                <div className="slider-container">
                  <button
                    className="slider-btn left"
                    onClick={() => scroll(popularRef, 'left')}
                  >
                    ‹
                  </button>
                  <div className="shop-books-slider" ref={popularRef}>
                    {allBooks.popular.map((book) => (
                      <div key={book.id} className="shop-book-card">
                        <div className="shop-book-image">
                          <img src={book.image} alt={book.title} />
                        </div>
                        <h3>{book.title}</h3>
                        <div className="shop-book-meta">
                          <span className="shop-author">{book.author}</span>
                          <div className="shop-rating">
                            {'⭐'.repeat(book.rating)}
                          </div>
                        </div>
                        <div className="shop-book-footer">
                          <span className="shop-price">${book.price}</span>
                          <button
                            className="shop-add-btn"
                            onClick={() => handleAddToCart(book)}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider-btn right"
                    onClick={() => scroll(popularRef, 'right')}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Best Collection Section */}
              <div className="shop-category-section">
                <h2 className="category-section-title">Best Collection</h2>
                <div className="slider-container">
                  <button
                    className="slider-btn left"
                    onClick={() => scroll(collectionRef, 'left')}
                  >
                    ‹
                  </button>
                  <div className="shop-books-slider" ref={collectionRef}>
                    {allBooks.collection.map((book) => (
                      <div key={book.id} className="shop-book-card">
                        <div className="shop-book-image">
                          <img src={book.image} alt={book.title} />
                        </div>
                        <h3>{book.title}</h3>
                        <div className="shop-book-meta">
                          <span className="shop-author">{book.author}</span>
                          <div className="shop-rating">
                            {'⭐'.repeat(book.rating)}
                          </div>
                        </div>
                        <div className="shop-book-footer">
                          <span className="shop-price">${book.price}</span>
                          <button
                            className="shop-add-btn"
                            onClick={() => handleAddToCart(book)}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider-btn right"
                    onClick={() => scroll(collectionRef, 'right')}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Best Selling Section */}
              <div className="shop-category-section">
                <h2 className="category-section-title">Best Selling Books</h2>
                <div className="slider-container">
                  <button
                    className="slider-btn left"
                    onClick={() => scroll(bestsellingRef, 'left')}
                  >
                    ‹
                  </button>
                  <div className="shop-books-slider" ref={bestsellingRef}>
                    {allBooks.bestselling.map((book) => (
                      <div key={book.id} className="shop-book-card">
                        <div className="shop-book-image">
                          <img src={book.image} alt={book.title} />
                        </div>
                        <h3>{book.title}</h3>
                        <div className="shop-book-meta">
                          <span className="shop-author">{book.author}</span>
                          <div className="shop-rating">
                            {'⭐'.repeat(book.rating)}
                          </div>
                        </div>
                        <div className="shop-book-footer">
                          <span className="shop-price">${book.price}</span>
                          <button
                            className="shop-add-btn"
                            onClick={() => handleAddToCart(book)}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider-btn right"
                    onClick={() => scroll(bestsellingRef, 'right')}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* New Arrivals Section */}
              <div className="shop-category-section">
                <h2 className="category-section-title">New Arrivals</h2>
                <div className="slider-container">
                  <button
                    className="slider-btn left"
                    onClick={() => scroll(newRef, 'left')}
                  >
                    ‹
                  </button>
                  <div className="shop-books-slider" ref={newRef}>
                    {allBooks.new.map((book) => (
                      <div key={book.id} className="shop-book-card">
                        <div className="shop-book-image">
                          <img src={book.image} alt={book.title} />
                        </div>
                        <h3>{book.title}</h3>
                        <div className="shop-book-meta">
                          <span className="shop-author">{book.author}</span>
                          <div className="shop-rating">
                            {'⭐'.repeat(book.rating)}
                          </div>
                        </div>
                        <div className="shop-book-footer">
                          <span className="shop-price">${book.price}</span>
                          <button
                            className="shop-add-btn"
                            onClick={() => handleAddToCart(book)}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider-btn right"
                    onClick={() => scroll(newRef, 'right')}
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Single category view with grid
            <div className="shop-books-grid">
              {displayBooks.map((book) => (
                <div key={book.id} className="shop-book-card">
                  <div className="shop-book-image">
                    <img src={book.image} alt={book.title} />
                  </div>
                  <h3>{book.title}</h3>
                  <div className="shop-book-meta">
                    <span className="shop-author">{book.author}</span>
                    <div className="shop-rating">
                      {'⭐'.repeat(book.rating)}
                    </div>
                  </div>
                  <div className="shop-book-footer">
                    <span className="shop-price">${book.price}</span>
                    <button
                      className="shop-add-btn"
                      onClick={() => handleAddToCart(book)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {displayBooks.length === 0 && selectedCategory !== 'all' && (
            <div className="no-results">
              <p>No books found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;