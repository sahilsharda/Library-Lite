// components/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { booksAPI, loansAPI, adminAPI } from '../api';
import './DashboardPage.css';

function DashboardPage({ onLogout, user }) {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('books'); // books, loans, members

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [booksData, loansData, dashboardStats] = await Promise.all([
        booksAPI.getAllBooks(),
        loansAPI.getAllLoans(),
        adminAPI.getDashboardStats().catch(() => null) // Admin stats might fail for non-admin
      ]);

      setBooks(booksData);
      setLoans(loansData);

      if (dashboardStats) {
        setStats(dashboardStats);
      } else {
        // Calculate basic stats from available data
        setStats({
          totalBooks: booksData.length,
          activeLoans: loansData.filter(loan => !loan.returnDate).length,
          overdueLoans: loansData.filter(loan =>
            !loan.returnDate && new Date(loan.dueDate) < new Date()
          ).length,
          totalMembers: 0
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const renderBooksList = () => (
    <div className="content-section">
      <h2 className="section-title">Available Books</h2>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div className="books-grid">
          {books.slice(0, 12).map(book => (
            <div key={book.id} className="book-card">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author?.name || 'Unknown'}</p>
              <p className="book-isbn">ISBN: {book.isbn}</p>
              <div className="book-status">
                <span className={`status-badge ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                  {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLoansList = () => (
    <div className="content-section">
      <h2 className="section-title">Active Loans</h2>
      {loans.filter(loan => !loan.returnDate).length === 0 ? (
        <p>No active loans</p>
      ) : (
        <div className="loans-list">
          {loans.filter(loan => !loan.returnDate).map(loan => (
            <div key={loan.id} className="loan-item">
              <div className="loan-info">
                <h3>{loan.book?.title || 'Unknown Book'}</h3>
                <p>Member: {loan.member?.user?.email || 'Unknown'}</p>
                <p>Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
              </div>
              <span className={`loan-status ${new Date(loan.dueDate) < new Date() ? 'overdue' : 'active'}`}>
                {new Date(loan.dueDate) < new Date() ? 'Overdue' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="dashboard-card">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="logo-small">
                <svg className="book-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="Library logo">
                  <title>Library logo</title>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="dashboard-title">Library Dashboard</h1>
                <p className="dashboard-subtitle">Welcome, {user?.email || 'User'}</p>
              </div>
            </div>
            <button type="button" onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button type="button" onClick={fetchDashboardData} className="retry-btn">Retry</button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Total Books</h3>
              <p className="stat-number">{stats.totalBooks}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Active Loans</h3>
              <p className="stat-number">{stats.activeLoans}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Overdue</h3>
              <p className="stat-number">{stats.overdueLoans}</p>
            </div>
            {stats.totalMembers > 0 && (
              <div className="stat-card">
                <h3 className="stat-title">Members</h3>
                <p className="stat-number">{stats.totalMembers}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              Books
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'loans' ? 'active' : ''}`}
              onClick={() => setActiveTab('loans')}
            >
              Loans
            </button>
          </div>

          {/* Content */}
          {activeTab === 'books' && renderBooksList()}
          {activeTab === 'loans' && renderLoansList()}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;