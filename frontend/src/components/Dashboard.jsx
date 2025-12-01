import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { userAPI } from '../api/user.js';
import './Dashboard.css';

function Dashboard() {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const isDemo = searchParams.get('demo') === '1';

  // Demo data
  const demoUser = useMemo(() => {
    if (!isDemo) return null;
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;
    return {
      id: 'demo-user',
      email: 'user@library.com',
      user_metadata: { full_name: 'John Reader', avatar_url: null },
      dbUser: { id: 'demo-db', fullName: 'John Reader', name: 'John' },
      dashboard: {
        stats: {
          totalBorrows: 8,
          activeBorrows: 3,
          overdueBorrows: 1,
          totalPurchases: 5,
          totalSpent: 12450,
          walletBalance: 37550,
        },
        loans: [
          {
            id: 1,
            status: 'borrowed',
            borrowDate: new Date(now - 5 * day).toISOString(),
            dueDate: new Date(now + 9 * day).toISOString(),
            daysRemaining: 9,
            book: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 599 },
          },
          {
            id: 2,
            status: 'overdue',
            borrowDate: new Date(now - 25 * day).toISOString(),
            dueDate: new Date(now - 2 * day).toISOString(),
            daysRemaining: -2,
            book: { title: '1984', author: 'George Orwell', price: 549 },
          },
        ],
        purchases: [
          { id: 1, bookTitle: 'The Art of Reading', bookPrice: 1299, purchaseDate: new Date(now - 10 * day).toISOString(), daysRemaining: 20 },
        ],
        payments: [
          { id: 1, amount: 1299, status: 'completed', method: 'UPI', paymentDate: new Date(now - 10 * day).toISOString(), loan: { bookTitle: 'The Art of Reading' } },
        ],
      },
    };
  }, [isDemo]);

  const user = isDemo ? demoUser : authUser;
  const isLoading = isDemo ? false : authLoading;

  // Use demo data or real dashboard data
  const dashboard = isDemo ? user?.dashboard : dashboardData;
  const stats = dashboard?.stats ?? {};
  const loans = dashboard?.loans ?? [];
  const purchases = dashboard?.purchases ?? [];
  const userPayments = dashboard?.payments ?? [];

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [],
  );

  const displayName = useMemo(() => {
    if (!user) return 'User';
    return (
      user?.dbUser?.fullName ||
      user?.dbUser?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'User'
    );
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return 'U';
    const parts = displayName.split(' ').filter(Boolean);
    if (!parts.length) return displayName[0]?.toUpperCase() || 'U';
    return parts.slice(0, 2).map((s) => s[0]?.toUpperCase() || '').join('');
  }, [displayName]);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.dbUser?.avatarUrl || null;

  // Get overdue books for reminders
  const overdueBooks = useMemo(() => {
    return loans.filter((loan) => loan.daysRemaining !== null && loan.daysRemaining < 0);
  }, [loans]);

  const dueSoonBooks = useMemo(() => {
    return loans.filter((loan) => loan.daysRemaining !== null && loan.daysRemaining >= 0 && loan.daysRemaining <= 3);
  }, [loans]);

  // Load dashboard data on mount
  useEffect(() => {
    if (isDemo || !authUser) return;

    const loadDashboard = async () => {
      try {
        const response = await userAPI.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };

    loadDashboard();
  }, [isDemo, authUser]);

  // Load page-specific data
  useEffect(() => {
    if (isDemo) return;
    const loadData = async () => {
      setLoading(true);
      try {
        if (activePage === 'books') {
          const booksData = await userAPI.getBooks(searchQuery, currentPage);
          setBooks(booksData.data || []);
          const myBooksData = await userAPI.getMyBooks();
          setMyBooks(myBooksData.data || []);
        } else if (activePage === 'orders') {
          const ordersData = await userAPI.getMyOrders();
          setOrders(ordersData.data || []);
        } else if (activePage === 'payments') {
          const paymentsData = await userAPI.getMyPayments();
          setPayments(paymentsData.data || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activePage, searchQuery, currentPage, isDemo]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-state">
        <p>You need to sign in to view the dashboard.</p>
        <button type="button" className="primary-btn" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${theme}`} data-theme={theme}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Library Logo</title>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Library Lite</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handlePageChange('dashboard')} className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Dashboard Icon</title>
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Dashboard</span>
          </button>
          <button onClick={() => handlePageChange('books')} className={`nav-item ${activePage === 'books' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Books Icon</title>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Books</span>
          </button>
          <button onClick={() => handlePageChange('orders')} className={`nav-item ${activePage === 'orders' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Orders Icon</title>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>My Orders</span>
          </button>
          <button onClick={() => handlePageChange('payments')} className={`nav-item ${activePage === 'payments' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Payments Icon</title>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>Payments</span>
          </button>
          <button onClick={() => handlePageChange('profile')} className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Profile Icon</title>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>
            <span>Profile</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => navigate('/')} className="nav-item back-home-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Home Icon</title>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1>
            {activePage === 'dashboard' && 'Dashboard'}
            {activePage === 'books' && 'Books'}
            {activePage === 'orders' && 'My Orders'}
            {activePage === 'payments' && 'Payments'}
            {activePage === 'profile' && 'My Profile'}
            {activePage === 'request-book' && 'Request a Book'}
            {activePage === 'add-payment' && 'Add Payment'}
            {activePage === 'support' && 'Support'}
          </h1>
          <div className="header-actions">
            {activePage === 'books' && (
              <div className="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
            <div className="user-menu">
              <div className="user-avatar">
                {avatarUrl ? <img src={avatarUrl} alt={displayName} /> : <span>{initials}</span>}
              </div>
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">Member</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          {activePage === 'dashboard' && (
            <DashboardHome
              stats={stats}
              loans={loans}
              purchases={purchases}
              overdueBooks={overdueBooks}
              dueSoonBooks={dueSoonBooks}
              currencyFormatter={currencyFormatter}
              isDemo={isDemo}
              onNavigate={handlePageChange}
            />
          )}

          {activePage === 'books' && (
            <BooksPage
              books={isDemo ? [] : books}
              myBooks={isDemo ? loans : myBooks}
              loading={loading}
              searchQuery={searchQuery}
              currencyFormatter={currencyFormatter}
              isDemo={isDemo}
            />
          )}

          {activePage === 'orders' && (
            <OrdersPage
              orders={isDemo ? purchases : orders}
              loading={loading}
              currencyFormatter={currencyFormatter}
              isDemo={isDemo}
            />
          )}

          {activePage === 'payments' && (
            <PaymentsPage
              payments={isDemo ? userPayments : payments}
              loading={loading}
              currencyFormatter={currencyFormatter}
              isDemo={isDemo}
            />
          )}

          {activePage === 'profile' && (
            <ProfilePage
              user={user}
              displayName={displayName}
              theme={theme}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
            />
          )}

          {activePage === 'request-book' && <RequestBookPage />}
          {activePage === 'add-payment' && <AddPaymentPage />}
          {activePage === 'support' && <SupportPage />}
        </div>
      </main>
    </div>
  );
}

// Dashboard Home Component
function DashboardHome({ stats, loans, purchases, overdueBooks, dueSoonBooks, currencyFormatter, onNavigate }) {
  const navigateTo = (page) => {
    // Find the parent component's handlePageChange or use a passed callback
    // Since we can't easily pass the setter down without prop drilling, 
    // we'll assume the parent passes a handler or we dispatch an event.
    // Actually, let's just pass the handler from the parent.
    // Wait, I need to update the Dashboard component to pass handlePageChange to DashboardHome.
    // I'll do that in a separate edit or assume it's passed.
    // Let's assume onNavigate is passed.
    onNavigate(page);
  };

  return (
    <>
      {/* Quick Actions */}
      <section className="quick-actions">
        <button className="action-card primary" onClick={() => onNavigate('books')}>
          <div className="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              <path d="M12 6h6"></path>
              <path d="M12 10h6"></path>
            </svg>
          </div>
          <span>Browse Books</span>
        </button>
        <button className="action-card" onClick={() => onNavigate('request-book')}>
          <div className="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <span>Request Book</span>
        </button>
        <button className="action-card" onClick={() => onNavigate('add-payment')}>
          <div className="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <span>Add Payment</span>
        </button>
        <button className="action-card" onClick={() => onNavigate('support')}>
          <div className="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span>Support</span>
        </button>
      </section>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon books">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">My Borrowed Books</p>
            <p className="stat-value">{stats.totalBorrows ?? loans.length}</p>
            <span className="stat-sub">{stats.activeBorrows ?? loans.filter(l => l.status === 'borrowed').length} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Returned Books</p>
            <p className="stat-value">{stats.returnedBorrows ?? loans.filter(l => l.status === 'returned').length}</p>
            <span className="stat-sub">{stats.totalBorrows ?? loans.length} total borrows</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Fines</p>
            <p className="stat-value">{currencyFormatter.format(stats.totalFines ?? 0)}</p>
            <span className="stat-sub">Paid: {currencyFormatter.format(stats.paidFines ?? 0)}</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon overdue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Overdue Books</p>
            <p className="stat-value">{overdueBooks.length}</p>
            <span className="stat-sub">{dueSoonBooks.length} due soon</span>
          </div>
        </div>
      </section>

      {/* Due Date Tracking & Reminders */}
      {(overdueBooks.length > 0 || dueSoonBooks.length > 0) && (
        <section className="reminders-section">
          <div className="section-header">
            <h2>Due Date Tracking & Reminders</h2>
            <p className="section-subtitle">Automated reminders ensure you never pay a late fee again</p>
          </div>
          <div className="reminders-grid">
            {overdueBooks.map((loan) => (
              <div key={loan.id} className="reminder-card overdue">
                <div className="reminder-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="reminder-content">
                  <h3>{loan.book?.title || 'Unknown Book'}</h3>
                  <p className="reminder-message">⚠️ Overdue by {Math.abs(loan.daysRemaining)} days</p>
                  <p className="reminder-due">Due: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</p>
                  {loan.fine > 0 && (
                    <p className="reminder-fine">Fine: {currencyFormatter.format(loan.fine)}</p>
                  )}
                </div>
              </div>
            ))}
            {dueSoonBooks.map((loan) => (
              <div key={loan.id} className="reminder-card warning">
                <div className="reminder-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="reminder-content">
                  <h3>{loan.book?.title || 'Unknown Book'}</h3>
                  <p className="reminder-message">⏰ Due in {loan.daysRemaining} days</p>
                  <p className="reminder-due">Due: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Books Section */}
      <section className="my-books-section">
        <div className="section-header">
          <h2>My Borrowed Books</h2>
        </div>
        <div className="books-grid">
          {loans.slice(0, 6).map((loan) => (
            <div key={loan.id} className="book-card">
              <div className="book-card-header">
                <h3>{loan.book?.title || 'Unknown Book'}</h3>
                <span className={`status-badge ${loan.status}`}>{loan.status}</span>
              </div>
              <p className="book-author">{loan.book?.author || 'Unknown Author'}</p>
              <div className="book-meta">
                <div>
                  <span className="label">Due Date</span>
                  <span className="value">{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div>
                  <span className="label">Days Remaining</span>
                  <span className={`value ${loan.daysRemaining !== null && loan.daysRemaining < 0 ? 'overdue' : loan.daysRemaining !== null && loan.daysRemaining <= 3 ? 'warning' : ''}`}>
                    {loan.daysRemaining !== null ? (loan.daysRemaining >= 0 ? `${loan.daysRemaining} days` : `${Math.abs(loan.daysRemaining)} days overdue`) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {loans.length === 0 && <p className="empty-state">No borrowed books yet</p>}
        </div>
      </section>
    </>
  );
}

// Books Page Component
function BooksPage({ books, myBooks, loading, searchQuery, currencyFormatter, isDemo }) {
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' or 'mybooks'
  const demoBooks = [
    { id: 1, title: 'The Great Gatsby', author: { name: 'F. Scott Fitzgerald' }, genre: ['Fiction'], price: 599, availableCopies: 5 },
    { id: 2, title: '1984', author: { name: 'George Orwell' }, genre: ['Dystopian'], price: 549, availableCopies: 3 },
    { id: 3, title: 'Pride and Prejudice', author: { name: 'Jane Austen' }, genre: ['Romance'], price: 499, availableCopies: 7 },
  ];

  const displayBooks = isDemo ? demoBooks : (viewMode === 'catalog' ? books : myBooks);

  return (
    <>
      <div className="page-tabs">
        <button className={`tab ${viewMode === 'catalog' ? 'active' : ''}`} onClick={() => setViewMode('catalog')}>
          Browse Catalog
        </button>
        <button className={`tab ${viewMode === 'mybooks' ? 'active' : ''}`} onClick={() => setViewMode('mybooks')}>
          My Borrowed Books
        </button>
      </div>

      {viewMode === 'catalog' && (
        <div className="catalog-section">
          <div className="section-header">
            <h2>Smart Cataloging</h2>
            <p className="section-subtitle">Browse and search through our extensive book collection</p>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading books...</p>
            </div>
          ) : (
            <div className="books-grid">
              {displayBooks.map((book) => (
                <div key={book.id} className="book-card">
                  {book.coverUrl && (
                    <div className="book-cover">
                      <img src={book.coverUrl} alt={book.title || book.name} />
                    </div>
                  )}
                  <div className="book-card-content">
                    <div className="book-card-header">
                      <h3>{book.title || book.name}</h3>
                    </div>
                    <p className="book-author">by {book.author?.name || book.author || 'Unknown Author'}</p>
                    {book.publisher && (
                      <p className="book-publisher">{book.publisher}</p>
                    )}
                    {book.publishedYear && (
                      <p className="book-year">Published: {book.publishedYear}</p>
                    )}
                    {book.pages && (
                      <p className="book-pages">{book.pages} pages</p>
                    )}
                    {book.description && (
                      <p className="book-description">{book.description.substring(0, 150)}...</p>
                    )}
                    <div className="book-tags">
                      {(book.genre || book.category || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>
                    <div className="book-availability">
                      <span className={book.availableCopies > 0 ? 'available' : 'unavailable'}>
                        {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Not available'}
                      </span>
                    </div>
                    <div className="book-actions">
                      <button className="btn-primary" disabled={book.availableCopies === 0}>
                        {book.availableCopies > 0 ? 'Borrow' : 'Unavailable'}
                      </button>
                      <button className="btn-secondary">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
              {displayBooks.length === 0 && (
                <p className="empty-state">No books found{searchQuery && ` for "${searchQuery}"`}</p>
              )}
            </div>
          )}
        </div>
      )}

      {viewMode === 'mybooks' && (
        <div className="my-books-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Author</th>
                <th>Borrowed Date</th>
                <th>Due Date</th>
                <th>Days Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayBooks.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.book?.title || 'Unknown'}</td>
                  <td>{loan.book?.author?.name || loan.book?.author || 'Unknown'}</td>
                  <td>{loan.borrowDate ? new Date(loan.borrowDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={loan.daysRemaining !== null && loan.daysRemaining < 0 ? 'overdue' : loan.daysRemaining !== null && loan.daysRemaining <= 3 ? 'warning' : ''}>
                      {loan.daysRemaining !== null ? (loan.daysRemaining >= 0 ? `${loan.daysRemaining} days` : `${Math.abs(loan.daysRemaining)} overdue`) : 'N/A'}
                    </span>
                  </td>
                  <td><span className={`status-badge ${loan.status}`}>{loan.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" title="Return Book">Return</button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayBooks.length === 0 && <tr><td colSpan="7" className="empty-row">No borrowed books</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// Orders Page Component
function OrdersPage({ orders, loading, currencyFormatter, isDemo }) {
  return (
    <>
      <div className="section-header">
        <h2>My Orders (Purchased Books)</h2>
        <p className="section-subtitle">Books you've purchased and their access status</p>
      </div>
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading orders...</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>{order.bookTitle || 'Unknown Book'}</h3>
                <span className={`status-badge ${order.daysRemaining > 0 ? 'active' : 'expired'}`}>
                  {order.daysRemaining > 0 ? 'Active' : 'Expired'}
                </span>
              </div>
              <div className="order-details">
                <div>
                  <span className="label">Purchase Date</span>
                  <span className="value">{order.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div>
                  <span className="label">Price</span>
                  <span className="value">{currencyFormatter.format(order.bookPrice || order.amount || 0)}</span>
                </div>
                <div>
                  <span className="label">Time Remaining</span>
                  <span className={`value ${order.daysRemaining <= 3 && order.daysRemaining > 0 ? 'warning' : ''}`}>
                    {order.daysRemaining > 0 ? `${order.daysRemaining} days` : 'Expired'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="empty-state">No orders yet</p>}
        </div>
      )}
    </>
  );
}

// Payments Page Component
function PaymentsPage({ payments, loading, currencyFormatter, isDemo }) {
  return (
    <>
      <div className="section-header">
        <h2>Payment History</h2>
        <p className="section-subtitle">All your payment transactions</p>
      </div>
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading payments...</p>
        </div>
      ) : (
        <div className="payments-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{payment.loan?.bookTitle || 'Library Payment'}</td>
                  <td>{payment.method || payment.paymentMethod || 'N/A'}</td>
                  <td>{currencyFormatter.format(payment.amount || 0)}</td>
                  <td><span className={`status-badge ${payment.status}`}>{payment.status}</span></td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan="5" className="empty-row">No payments yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// Settings Page Component
// Profile Page Component
function ProfilePage({ user, displayName, theme, toggleTheme, handleLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.dbUser?.fullName || displayName || '',
    bio: 'Avid reader and book enthusiast.',
    phone: user?.dbUser?.phone || '',
    address: user?.dbUser?.address || '',
    jobTitle: 'Software Engineer',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await userAPI.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-cover"></div>
        <div className="profile-info-wrapper">
          <div className="profile-avatar-large">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt={displayName} />
            ) : (
              <span>{displayName?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="profile-text">
            <h2>{displayName}</h2>
            <p>{user?.email}</p>
            <span className="profile-badge">Premium Member</span>
          </div>
          <div className="profile-header-actions">
            <button
              className={`btn-primary ${isEditing ? 'hidden' : ''}`}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            {isEditing && (
              <div className="edit-actions">
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        {/* Left Column - Personal Info */}
        <div className="profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
          </div>
          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="read-only"
              />
              <span className="helper-text">Email cannot be changed</span>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className={isEditing ? 'editable' : ''}
                placeholder="123 Book Street, Library City"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Settings & Preferences */}
        <div className="profile-right-col">
          <div className="profile-card">
            <div className="card-header">
              <h3>Preferences</h3>
            </div>
            <div className="preferences-list">
              <div className="preference-item">
                <div className="pref-info">
                  <h4>Dark Mode</h4>
                  <p>Switch between light and dark themes</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="pref-info">
                  <h4>Email Notifications</h4>
                  <p>Receive updates about your loans</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="profile-card danger-zone">
            <div className="card-header">
              <h3>Account Actions</h3>
            </div>
            <div className="danger-actions">
              <button className="btn-danger full-width" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
// Request Book Page
function RequestBookPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-state">
        <div className="success-icon">✓</div>
        <h3>Request Submitted!</h3>
        <p>We'll notify you when the book becomes available.</p>
        <button className="btn-primary" onClick={() => setSubmitted(false)}>Request Another</button>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="card-header">
          <h3>Request a Book</h3>
          <p>Can't find what you're looking for? Let us know!</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book Title</label>
            <input type="text" required placeholder="e.g. The Hobbit" />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input type="text" required placeholder="e.g. J.R.R. Tolkien" />
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea placeholder="Any specific edition or details..." rows="3"></textarea>
          </div>
          <button type="submit" className="btn-primary full-width">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

// Add Payment Page
function AddPaymentPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-state">
        <div className="success-icon">✓</div>
        <h3>Payment Method Added!</h3>
        <p>Your card has been securely saved.</p>
        <button className="btn-primary" onClick={() => setSubmitted(false)}>Add Another</button>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="card-header">
          <h3>Add Payment Method</h3>
          <p>Securely add a new card for future payments</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Number</label>
            <input type="text" required placeholder="0000 0000 0000 0000" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input type="text" required placeholder="MM/YY" />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input type="text" required placeholder="123" />
            </div>
          </div>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input type="text" required placeholder="Name on card" />
          </div>
          <button type="submit" className="btn-primary full-width">Add Card</button>
        </form>
      </div>
    </div>
  );
}

// Support Page
function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-state">
        <div className="success-icon">✓</div>
        <h3>Message Sent!</h3>
        <p>Our support team will get back to you shortly.</p>
        <button className="btn-primary" onClick={() => setSubmitted(false)}>Send Another Message</button>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="card-header">
          <h3>Contact Support</h3>
          <p>How can we help you today?</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject</label>
            <select>
              <option>General Inquiry</option>
              <option>Technical Issue</option>
              <option>Billing Question</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea required placeholder="Describe your issue..." rows="5"></textarea>
          </div>
          <button type="submit" className="btn-primary full-width">Send Message</button>
        </form>
      </div>
    </div>
  );
}
