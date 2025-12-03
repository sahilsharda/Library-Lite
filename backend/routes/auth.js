import express from "express";
import supabase from "../supabase/supabase.js";
import prisma from "../prisma/prismaClient.js";

const router = express.Router();

const buildUserDashboard = async (authId) => {
  if (!authId) {
    return { dbUser: null, dashboard: null };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { authId },
      include: {
        member: true,
        loans: {
          orderBy: { borrowDate: "desc" },
          include: {
            book: {
              select: {
                id: true,
                title: true,
                coverUrl: true,
                author: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
          include: {
            loan: {
              select: {
                id: true,
                book: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
        reservations: {
          orderBy: { reservedAt: "desc" },
          include: {
            book: {
              select: {
                title: true,
                author: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      return { dbUser: null, dashboard: null };
    }

    const now = new Date();
    const msInDay = 1000 * 60 * 60 * 24;

    const loans = (dbUser.loans || []).map((loan) => {
      const borrowDate = loan.borrowDate ? new Date(loan.borrowDate) : null;
      const dueDate = loan.dueDate ? new Date(loan.dueDate) : null;
      const durationDays =
        borrowDate && dueDate
          ? Math.max(1, Math.ceil((dueDate - borrowDate) / msInDay))
          : null;
      const daysRemaining =
        dueDate !== null ? Math.ceil((dueDate - now) / msInDay) : null;

      return {
        id: loan.id,
        status: loan.status,
        borrowDate: loan.borrowDate,
        dueDate: loan.dueDate,
        returnDate: loan.returnDate,
        fine: loan.fine,
        durationDays,
        daysRemaining,
        book: {
          id: loan.book?.id,
          title: loan.book?.title,
          author: loan.book?.author?.name,
          coverUrl: loan.book?.coverUrl,
          price: loan.book?.price || 0,
        },
      };
    });

    const payments = (dbUser.payments || []).map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      method: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      loanId: payment.loanId,
      loan: payment.loan
        ? {
            id: payment.loan.id,
            bookTitle: payment.loan.book?.title,
            bookPrice: payment.loan.book?.price || 0,
          }
        : null,
    }));

    // Treat payments for books as purchases (for demo purposes)
    // In production, you'd have a separate Purchase model
    const purchases = payments
      .filter((p) => p.status === "completed" && p.loan?.bookTitle)
      .map((payment) => {
        // Simulate purchase access period (30 days from purchase)
        const purchaseDate = new Date(payment.paymentDate);
        const accessExpiry = new Date(purchaseDate);
        accessExpiry.setDate(accessExpiry.getDate() + 30);
        const daysRemaining = Math.ceil((accessExpiry - now) / msInDay);

        return {
          id: `purchase-${payment.id}`,
          bookTitle: payment.loan.bookTitle,
          bookPrice: payment.loan.bookPrice || payment.amount,
          purchaseDate: payment.paymentDate,
          accessExpiry: accessExpiry.toISOString(),
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          amount: payment.amount,
          method: payment.method,
        };
      });

    const reservations = (dbUser.reservations || []).map((reservation) => ({
      id: reservation.id,
      status: reservation.status,
      reservedAt: reservation.reservedAt ?? reservation.createdAt,
      expiresAt: reservation.expiresAt,
      bookTitle: reservation.book?.title,
      author: reservation.book?.author?.name,
    }));

    const completedPayments = payments.filter(
      (payment) => payment.status === "completed",
    );
    const totalSpent = completedPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0,
    );
    const totalFines = loans.reduce((sum, loan) => sum + (loan.fine || 0), 0);
    const activeLoans = loans.filter((loan) => loan.status === "borrowed");
    const overdueLoans = loans.filter(
      (loan) =>
        loan.status === "overdue" ||
        (loan.status === "borrowed" && (loan.daysRemaining ?? 0) < 0),
    );

    // Calculate wallet balance (simulated - in production this would come from User model)
    // For now, we'll simulate it as: initial balance - total spent
    const initialWalletBalance = 5000; // Simulated initial balance
    const walletBalance = Math.max(0, initialWalletBalance - totalSpent);

    const dashboard = {
      stats: {
        totalBorrows: loans.length,
        activeBorrows: activeLoans.length,
        overdueBorrows: overdueLoans.length,
        completedBorrows: loans.filter((loan) => loan.status === "returned")
          .length,
        totalPurchases: purchases.length,
        activePurchases: purchases.filter((p) => p.daysRemaining > 0).length,
        totalSpent,
        totalFines,
        walletBalance,
        averageSpend:
          completedPayments.length > 0
            ? totalSpent / completedPayments.length
            : 0,
      },
      subscription: dbUser.member
        ? {
            membershipType: dbUser.member.membershipType,
            status: dbUser.member.status,
            startedAt: dbUser.member.startDate,
            expiresAt: dbUser.member.expiryDate,
          }
        : null,
      loans,
      purchases,
      payments,
      reservations,
    };

    return { dbUser, dashboard };
  } catch (error) {
    console.error("buildUserDashboard error:", error);
    return { dbUser: null, dashboard: null };
  }
};

const attachDashboardToUser = async (authUser) => {
  if (!authUser) return authUser;
  const { dbUser, dashboard } = await buildUserDashboard(authUser.id);
  return {
    ...authUser,
    dbUser,
    dashboard,
  };
};

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName, confirmPassword, role, phone, address } =
      req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Validate full name
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        error: "Full name is required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Validate password match (if confirmPassword is provided)
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // Validate role (default to member if not provided)
    const userRole =
      role && ["admin", "librarian", "member"].includes(role) ? role : "member";

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: userRole,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Create user record in database using Prisma
    if (data.user) {
      try {
        // Check if user already exists in database
        let newUser = await prisma.user.findUnique({
          where: { email: data.user.email },
        });

        if (!newUser) {
          // Create new user if doesn't exist
          newUser = await prisma.user.create({
            data: {
              authId: data.user.id,
              email: data.user.email,
              fullName: fullName.trim(),
              name: fullName.trim().split(" ")[0], // Use first name
              role: userRole,
              phone: phone || null,
              address: address || null,
            },
          });
        } else {
          // Update existing user if found
          newUser = await prisma.user.update({
            where: { email: data.user.email },
            data: {
              authId: data.user.id,
              fullName: fullName.trim(),
              name: fullName.trim().split(" ")[0],
              role: userRole,
              phone: phone || null,
              address: address || null,
            },
          });
        }

        // Create member record if role is member
        if (userRole === "member") {
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

          // Check if member record already exists
          const existingMember = await prisma.member.findUnique({
            where: { userId: newUser.id },
          });

          if (!existingMember) {
            await prisma.member.create({
              data: {
                userId: newUser.id,
                membershipType: "basic",
                startDate: new Date(),
                expiryDate: thirtyDaysFromNow,
                status: "active",
              },
            });
          }
        }

        const enrichedUser = await attachDashboardToUser(data.user);

        res.status(201).json({
          message: "User created successfully",
          user: enrichedUser,
          session: data.session,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(201).json({
          message: "User created in auth, but database sync failed",
          user: data.user,
          session: data.session,
          warning: "Please contact support if you experience issues",
        });
      }
    } else {
      res.status(201).json({
        message: "User created successfully",
        user: data.user,
        session: data.session,
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Ensure user exists in the database & build dashboard
    if (data.user) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { authId: data.user.id },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              authId: data.user.id,
              email: data.user.email,
              fullName: data.user.user_metadata?.full_name || null,
              name: data.user.user_metadata?.full_name || email.split("@")[0],
            },
          });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    const enrichedUser = await attachDashboardToUser(data.user);

    res.status(200).json({
      message: "Login successful",
      user: enrichedUser,
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route
router.post("/logout", async (_req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user route
router.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const enrichedUser = await attachDashboardToUser(user);

    res.status(200).json({
      user: enrichedUser,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
