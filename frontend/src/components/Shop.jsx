import React, { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../App';
import Footer from './Footer';
import './Shop.css';

const Shop = () => {
  const [searchParams] = useSearchParams();
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

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const allBooks = {
    popular: [
      { id: 1, title: 'All Of Twenty Nine', author: 'Amy Johns', price: 65.99, rating: 4, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
      { id: 2, title: 'Scholar Select', author: 'John Smith', price: 45.99, rating: 5, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400' },
      { id: 3, title: 'A Short History of English Poetry', author: 'Heinemann', price: 55.99, rating: 4, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
      { id: 16, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 42.99, rating: 5, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
      { id: 17, title: '1984', author: 'George Orwell', price: 48.99, rating: 5, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400' },
      { id: 18, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 52.99, rating: 5, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
    ],
    collection: [
      { id: 4, title: 'The Spirit Catches You', author: 'Anne Fadiman', price: 85.99, rating: 5, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { id: 5, title: 'Alice Feeney - His & Hers', author: 'Alice Feeney', price: 55.99, rating: 4, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { id: 6, title: 'Scholar Select Premium', author: 'Premium Edition', price: 85.99, rating: 4, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { id: 7, title: 'Select Title', author: 'Various Authors', price: 95.99, rating: 5, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { id: 19, title: 'Pride and Prejudice', author: 'Jane Austen', price: 58.99, rating: 5, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { id: 20, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 62.99, rating: 4, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    ],
    bestselling: [
      { id: 8, title: 'Sometimes I Lie', author: 'Alice Feeney', price: 85.99, rating: 4, image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400' },
      { id: 9, title: 'The Book Eaters', author: 'Sunyi Dean', price: 85.99, rating: 4, image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400' },
      { id: 10, title: 'I Know Who You Are', author: 'Alice Feeney', price: 85.99, rating: 4, image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400' },
      { id: 11, title: 'White Stone Gate', author: 'Various Authors', price: 85.99, rating: 5, image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400' },
      { id: 21, title: 'Where the Crawdads Sing', author: 'Delia Owens', price: 78.99, rating: 5, image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400' },
      { id: 22, title: 'The Silent Patient', author: 'Alex Michaelides', price: 72.99, rating: 4, image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400' },
    ],
    new: [
      { id: 12, title: 'The Midnight Library', author: 'Matt Haig', price: 72.99, rating: 5, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
      { id: 13, title: 'Atomic Habits', author: 'James Clear', price: 68.99, rating: 5, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
      { id: 14, title: 'The Seven Husbands', author: 'Taylor Jenkins Reid', price: 78.99, rating: 4, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
      { id: 15, title: 'Project Hail Mary', author: 'Andy Weir', price: 82.99, rating: 5, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
      { id: 23, title: 'The Push', author: 'Ashley Audrain', price: 69.99, rating: 4, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
      { id: 24, title: 'Klara and the Sun', author: 'Kazuo Ishiguro', price: 74.99, rating: 5, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
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
          <Link to="/" className="logo">BestBook.com</Link>
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
            <button className="user-btn">👤</button>
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

      <Footer />
    </div>
  );
};

export default Shop;