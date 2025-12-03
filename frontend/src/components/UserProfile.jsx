import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./UserProfile.css";

function UserProfile() {
  const { user: authUser, loading: authLoading, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isDemo = searchParams.get("demo") === "1";

  const demoUser = useMemo(() => {
    if (!isDemo) return null;
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;

    return {
      id: "demo-user",
      email: "luna.reader@example.com",
      user_metadata: {
        full_name: "Luna Reader",
        avatar_url: "https://i.pravatar.cc/150?img=47",
      },
      dbUser: {
        fullName: "Luna Reader",
        name: "Luna",
        avatarUrl: "https://i.pravatar.cc/150?img=47",
        member: {
          membershipType: "premium",
          status: "active",
          startDate: new Date(now - 320 * day).toISOString(),
          expiryDate: new Date(now + 320 * day).toISOString(),
        },
      },
      dashboard: {
        stats: {
          totalBorrows: 12,
          activeBorrows: 2,
          overdueBorrows: 1,
          completedBorrows: 9,
          totalPurchases: 8,
          activePurchases: 5,
          totalSpent: 12450,
          totalFines: 250,
          walletBalance: 37550,
          averageSpend: 1556,
        },
        subscription: {
          membershipType: "Premium",
          status: "active",
          startedAt: new Date(now - 350 * day).toISOString(),
          expiresAt: new Date(now + 15 * day).toISOString(),
        },
        loans: [
          {
            id: "loan-1",
            status: "borrowed",
            borrowDate: new Date(now - 5 * day).toISOString(),
            dueDate: new Date(now + 9 * day).toISOString(),
            returnDate: null,
            fine: 0,
            durationDays: 14,
            daysRemaining: 9,
            book: {
              id: 101,
              title: "The Infinite Library",
              author: "Ada Finch",
              coverUrl: null,
              price: 599,
            },
          },
          {
            id: "loan-2",
            status: "overdue",
            borrowDate: new Date(now - 25 * day).toISOString(),
            dueDate: new Date(now - 2 * day).toISOString(),
            returnDate: null,
            fine: 250,
            durationDays: 21,
            daysRemaining: -2,
            book: {
              id: 102,
              title: "Chronicles of Time",
              author: "Milo Hart",
              coverUrl: null,
              price: 899,
            },
          },
          {
            id: "loan-3",
            status: "returned",
            borrowDate: new Date(now - 55 * day).toISOString(),
            dueDate: new Date(now - 42 * day).toISOString(),
            returnDate: new Date(now - 40 * day).toISOString(),
            fine: 0,
            durationDays: 14,
            daysRemaining: 0,
            book: {
              id: 103,
              title: "Designing Worlds",
              author: "Caro Bloom",
              coverUrl: null,
              price: 749,
            },
          },
        ],
        purchases: [
          {
            id: "purchase-1",
            bookTitle: "The Art of Reading",
            bookPrice: 1299,
            purchaseDate: new Date(now - 10 * day).toISOString(),
            accessExpiry: new Date(now + 20 * day).toISOString(),
            daysRemaining: 20,
            amount: 1299,
            method: "UPI",
          },
          {
            id: "purchase-2",
            bookTitle: "Digital Minds",
            bookPrice: 1599,
            purchaseDate: new Date(now - 15 * day).toISOString(),
            accessExpiry: new Date(now + 15 * day).toISOString(),
            daysRemaining: 15,
            amount: 1599,
            method: "Card",
          },
          {
            id: "purchase-3",
            bookTitle: "Future of Books",
            bookPrice: 999,
            purchaseDate: new Date(now - 20 * day).toISOString(),
            accessExpiry: new Date(now + 10 * day).toISOString(),
            daysRemaining: 10,
            amount: 999,
            method: "Wallet",
          },
          {
            id: "purchase-4",
            bookTitle: "Reading Revolution",
            bookPrice: 1899,
            purchaseDate: new Date(now - 25 * day).toISOString(),
            accessExpiry: new Date(now + 5 * day).toISOString(),
            daysRemaining: 5,
            amount: 1899,
            method: "UPI",
          },
          {
            id: "purchase-5",
            bookTitle: "Book Lovers Guide",
            bookPrice: 799,
            purchaseDate: new Date(now - 28 * day).toISOString(),
            accessExpiry: new Date(now + 2 * day).toISOString(),
            daysRemaining: 2,
            amount: 799,
            method: "Card",
          },
        ],
        payments: [
          {
            id: "pay-1",
            amount: 1299,
            status: "completed",
            method: "UPI",
            paymentDate: new Date(now - 10 * day).toISOString(),
            loanId: null,
            loan: {
              id: null,
              bookTitle: "The Art of Reading",
              bookPrice: 1299,
            },
          },
          {
            id: "pay-2",
            amount: 1599,
            status: "completed",
            method: "Card",
            paymentDate: new Date(now - 15 * day).toISOString(),
            loanId: null,
            loan: {
              id: null,
              bookTitle: "Digital Minds",
              bookPrice: 1599,
            },
          },
          {
            id: "pay-3",
            amount: 250,
            status: "completed",
            method: "UPI",
            paymentDate: new Date(now - 3 * day).toISOString(),
            loanId: 102,
            loan: {
              id: 102,
              bookTitle: "Chronicles of Time",
              bookPrice: 899,
            },
          },
        ],
      },
    };
  }, [isDemo]);

  const user = isDemo ? demoUser : authUser;
  const loading = isDemo ? false : authLoading;

  const dashboard = user?.dashboard ?? {};
  const stats = dashboard.stats ?? {};
  const loans = dashboard.loans ?? [];
  const purchases = dashboard.purchases ?? [];
  const payments = dashboard.payments ?? [];
  const subscription = dashboard.subscription;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [],
  );

  const activeLoans = useMemo(
    () =>
      loans.filter(
        (loan) => loan.status === "borrowed" || loan.status === "overdue",
      ),
    [loans],
  );
  const completedLoans = useMemo(
    () => loans.filter((loan) => loan.status === "returned"),
    [loans],
  );

  const displayName = useMemo(() => {
    if (!user) return "";
    return (
      user?.dbUser?.fullName ||
      user?.dbUser?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      ""
    );
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return "U";
    const parts = displayName.split(" ").filter(Boolean);
    if (!parts.length) return displayName[0]?.toUpperCase() || "U";
    return parts
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() || "")
      .join("");
  }, [displayName]);

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.dbUser?.avatarUrl || null;

  const handleRefresh = async () => {
    if (isDemo) {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 800);
      return;
    }

    setRefreshing(true);
    try {
      await refreshUser({ silent: true });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-state">
        <div className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-state">
        <p>You need to sign in to view your dashboard.</p>
        <button
          type="button"
          className="primary-btn"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-gradient" />
      <div className="profile-content">
        <header className="profile-hero">
          <div className="profile-identity">
            <div className="profile-avatar profile-avatar-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div>
              <p className="profile-greeting">Welcome back</p>
              <h1>{displayName || "Reader"}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>
          {isDemo && <span className="demo-pill">Demo Mode</span>}
          <div className="profile-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate("/")}
            >
              Explore Catalog
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={handleRefresh}
              disabled={refreshing || isDemo}
            >
              {isDemo
                ? "Login to Sync"
                : refreshing
                  ? "Refreshing..."
                  : "Sync Latest Data"}
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card wallet-card">
            <p>Wallet Balance</p>
            <h3>{currencyFormatter.format(stats.walletBalance ?? 0)}</h3>
            <span>Available to spend</span>
          </div>
          <div className="stat-card">
            <p>Total Borrows</p>
            <h3>{stats.totalBorrows ?? loans.length}</h3>
            <span>
              {stats.completedBorrows ?? completedLoans.length} completed
            </span>
          </div>
          <div className="stat-card">
            <p>Active Borrows</p>
            <h3>{stats.activeBorrows ?? activeLoans.length}</h3>
            <span>{stats.overdueBorrows ?? 0} overdue</span>
          </div>
          <div className="stat-card">
            <p>Purchased Books</p>
            <h3>{stats.totalPurchases ?? purchases.length}</h3>
            <span>
              {stats.activePurchases ??
                purchases.filter((p) => p.daysRemaining > 0).length}{" "}
              active
            </span>
          </div>
          <div className="stat-card">
            <p>Total Spent</p>
            <h3>{currencyFormatter.format(stats.totalSpent ?? 0)}</h3>
            <span>
              Avg {currencyFormatter.format(stats.averageSpend ?? 0)} /
              transaction
            </span>
          </div>
          <div className="stat-card">
            <p>Total Fines</p>
            <h3>{currencyFormatter.format(stats.totalFines ?? 0)}</h3>
            <span>Pending payments</span>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel subscription-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Membership</p>
                <h3>Subscription Status</h3>
              </div>
            </div>
            {subscription ? (
              <div className="subscription-body">
                <div>
                  <p className="label">Plan</p>
                  <p className="value">{subscription.membershipType}</p>
                </div>
                <div>
                  <p className="label">Status</p>
                  <p className={`badge ${subscription.status}`}>
                    {subscription.status}
                  </p>
                </div>
                <div>
                  <p className="label">Started</p>
                  <p className="value">
                    {subscription.startedAt
                      ? new Date(subscription.startedAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="label">Expires</p>
                  <p className="value">
                    {subscription.expiresAt
                      ? new Date(subscription.expiresAt).toLocaleDateString()
                      : "No expiry"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="subscription-empty">
                <p>You don’t have an active membership yet.</p>
                <span>Contact the librarian to activate your plan.</span>
              </div>
            )}
          </div>

          <div className="panel spend-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Spending</p>
                <h3>Payment Summary</h3>
              </div>
              <span className="chip">{payments.length} payments</span>
            </div>
            <div className="spend-body">
              <div>
                <p className="label">Total Paid</p>
                <p className="value">
                  {currencyFormatter.format(stats.totalSpent ?? 0)}
                </p>
              </div>
              <div>
                <p className="label">Average Payment</p>
                <p className="value">
                  {currencyFormatter.format(stats.averageSpend ?? 0)}
                </p>
              </div>
              <div>
                <p className="label">Last Payment</p>
                <p className="value">
                  {payments[0]?.paymentDate
                    ? new Date(payments[0].paymentDate).toLocaleDateString()
                    : "No payments yet"}
                </p>
              </div>
            </div>
            <div className="payment-list">
              {payments.slice(0, 4).map((payment) => (
                <div key={payment.id} className="payment-row">
                  <div>
                    <p className="payment-title">
                      {payment.loan?.bookTitle || "Library payment"}
                    </p>
                    <span>{payment.method}</span>
                  </div>
                  <div className="payment-amount">
                    <p>{currencyFormatter.format(payment.amount)}</p>
                    <span>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="empty-text">No payments recorded yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className="panel purchases-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Purchased Books</p>
              <h3>Your Library</h3>
            </div>
            <span className="chip">
              {purchases.filter((p) => p.daysRemaining > 0).length} active •{" "}
              {purchases.length} total
            </span>
          </div>
          <div className="purchase-list">
            {purchases.length === 0 && (
              <p className="empty-text">You haven't purchased any books yet.</p>
            )}
            {purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <div className="purchase-heading">
                  <div>
                    <p className="purchase-title">
                      {purchase.bookTitle || "Untitled Book"}
                    </p>
                    <span className="purchase-price">
                      {currencyFormatter.format(
                        purchase.bookPrice || purchase.amount,
                      )}
                    </span>
                  </div>
                  <span
                    className={`badge ${purchase.daysRemaining > 0 ? "active" : "expired"}`}
                  >
                    {purchase.daysRemaining > 0 ? "Active" : "Expired"}
                  </span>
                </div>
                <div className="purchase-meta">
                  <div>
                    <p className="label">Purchased</p>
                    <p className="value">
                      {purchase.purchaseDate
                        ? new Date(purchase.purchaseDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="label">Access Expires</p>
                    <p className="value">
                      {purchase.accessExpiry
                        ? new Date(purchase.accessExpiry).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="label">Payment Method</p>
                    <p className="value">{purchase.method || "—"}</p>
                  </div>
                  <div>
                    <p className="label">Time Remaining</p>
                    <p
                      className={`value ${purchase.daysRemaining <= 3 ? "warning" : ""}`}
                    >
                      {purchase.daysRemaining > 0
                        ? `${purchase.daysRemaining} days`
                        : "Expired"}
                    </p>
                  </div>
                </div>
                {purchase.daysRemaining > 0 && (
                  <div className="purchase-progress">
                    <div
                      className={`progress-bar ${purchase.daysRemaining <= 3 ? "warning" : ""}`}
                      style={{
                        width: `${Math.min(100, (purchase.daysRemaining / 30) * 100)}%`,
                      }}
                    />
                    <span>
                      {purchase.daysRemaining} days of access remaining
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="panel borrows-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Borrowed Books</p>
              <h3>Current & Past Borrows</h3>
            </div>
            <span className="chip">
              {activeLoans.length} active • {completedLoans.length} returned
            </span>
          </div>
          <div className="borrow-list">
            {loans.length === 0 && (
              <p className="empty-text">You haven't borrowed any books yet.</p>
            )}
            {loans.map((loan) => {
              const daysRemaining = loan.daysRemaining ?? null;
              const safeDuration =
                loan.durationDays && loan.durationDays > 0
                  ? loan.durationDays
                  : 1;
              const progressPercent = loan.durationDays
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      ((safeDuration - Math.max(0, daysRemaining ?? 0)) /
                        safeDuration) *
                        100,
                    ),
                  )
                : 0;

              return (
                <div key={loan.id} className="borrow-card">
                  <div className="borrow-heading">
                    <div>
                      <p className="borrow-title">
                        {loan.book?.title || "Untitled Book"}
                      </p>
                      <span>{loan.book?.author || "Unknown Author"}</span>
                      {loan.book?.price && (
                        <span className="book-price">
                          Price: {currencyFormatter.format(loan.book.price)}
                        </span>
                      )}
                    </div>
                    <span className={`badge ${loan.status}`}>
                      {loan.status}
                    </span>
                  </div>
                  <div className="borrow-meta">
                    <div>
                      <p className="label">Borrowed</p>
                      <p className="value">
                        {loan.borrowDate
                          ? new Date(loan.borrowDate).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="label">Due Date</p>
                      <p className="value">
                        {loan.dueDate
                          ? new Date(loan.dueDate).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="label">Borrow Period</p>
                      <p className="value">
                        {loan.durationDays ? `${loan.durationDays} days` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="label">Fine Amount</p>
                      <p className="value">
                        {loan.fine
                          ? currencyFormatter.format(loan.fine)
                          : currencyFormatter.format(0)}
                      </p>
                    </div>
                  </div>
                  {daysRemaining !== null && (
                    <div className="borrow-progress">
                      <div
                        className={`progress-bar ${
                          loan.status === "overdue" || (daysRemaining ?? 0) < 0
                            ? "danger"
                            : ""
                        }`}
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />
                      <span>
                        {daysRemaining >= 0
                          ? `${daysRemaining} days remaining`
                          : `${Math.abs(daysRemaining)} days overdue`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserProfile;
