import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../App';
import Footer from './Footer';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
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

      <div className="container cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some books to get started!</p>
            <Link to="/shop" className="continue-shopping-btn">Browse Books</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-product">
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h3>{item.title}</h3>
                      <p>By {item.author}</p>
                    </div>
                  </div>
                  
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  
                  <div className="item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <p className="free-shipping-note">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
          <Link to="/shop" className="continue-link">← Continue Shopping</Link>
        </div>
      </div>
    )}
  </div>

  <Footer />
</div>
);
};
export default Cart;