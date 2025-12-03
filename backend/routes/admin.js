import express from "express";
import prisma from "../prisma/prismaClient.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// Get dashboard statistics and reports
router.get("/reports", isAdmin, async (_req, res) => {
  try {
    const [
      totalUsers,
      totalMembers,
      activeMembers,
      totalBooks,
      totalAuthors,
      availableBooks,
      activeLoans,
      overdueLoans,
      totalReservations,
      totalPayments,
      totalFinesCollected,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.member.count(),
      prisma.member.count({ where: { status: "active" } }),
      prisma.book.count(),
      prisma.author.count(),
      prisma.book.aggregate({
        _sum: { availableCopies: true },
      }),
      prisma.loan.count({
        where: { status: "borrowed" },
      }),
      prisma.loan.count({
        where: {
          status: "borrowed",
          dueDate: {
            lt: new Date(),
          },
        },
      }),
      prisma.reservation.count({
        where: { status: "pending" },
      }),
      prisma.payment.count(),
      prisma.payment.aggregate({
        where: { status: "completed" },
        _sum: { amount: true },
      }),
    ]);

    const topBorrowedBooks = await prisma.loan.groupBy({
      by: ["bookId"],
      _count: {
        bookId: true,
      },
      orderBy: {
        _count: {
          bookId: "desc",
        },
      },
      take: 10,
    });

    const bookDetails = await Promise.all(
      topBorrowedBooks.map(async (item) => {
        const book = await prisma.book.findUnique({
          where: { id: item.bookId },
          select: {
            id: true,
            title: true,
            isbn: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        });
        return {
          ...book,
          borrowCount: item._count.bookId,
        };
      }),
    );

    const recentActivity = await prisma.activityLog.findMany({
      take: 20,
      orderBy: {
        timestamp: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
            name: true,
          },
        },
      },
    });

    const monthlyStats = await prisma.loan.groupBy({
      by: ["borrowDate"],
      _count: {
        id: true,
      },
      orderBy: {
        borrowDate: "desc",
      },
      take: 12,
    });

    const genreDistribution = await prisma.book.findMany({
      select: {
        genre: true,
      },
    });

    const genreCounts = genreDistribution.reduce((acc, book) => {
      book.genre.forEach((g) => {
        acc[g] = (acc[g] || 0) + 1;
      });
      return acc;
    }, {});

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMembers,
          activeMembers,
          totalBooks,
          totalAuthors,
          availableBooks: availableBooks._sum.availableCopies || 0,
          activeLoans,
          overdueLoans,
          totalReservations,
          totalPayments,
          totalFinesCollected: totalFinesCollected._sum.amount || 0,
        },
        topBorrowedBooks: bookDetails,
        recentActivity: recentActivity.slice(0, 10),
        monthlyBorrowingTrend: monthlyStats,
        genreDistribution: topGenres,
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Get activity logs
router.get("/logs", isAdmin, async (req, res) => {
  try {
    const {
      userId,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              name: true,
              role: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          timestamp: sortOrder,
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// Get user statistics
router.get("/users/stats", isAdmin, async (_req, res) => {
  try {
    const userRoleDistribution = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    const memberStatusDistribution = await prisma.member.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const membershipTypeDistribution = await prisma.member.groupBy({
      by: ["membershipType"],
      _count: {
        membershipType: true,
      },
    });

    const topBorrowers = await prisma.loan.groupBy({
      by: ["userId"],
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 10,
    });

    const borrowerDetails = await Promise.all(
      topBorrowers.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id: item.userId },
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
          },
        });
        return {
          ...user,
          borrowCount: item._count.userId,
        };
      }),
    );

    res.status(200).json({
      success: true,
      data: {
        userRoleDistribution,
        memberStatusDistribution,
        membershipTypeDistribution,
        topBorrowers: borrowerDetails,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

// Get book statistics
router.get("/books/stats", isAdmin, async (_req, res) => {
  try {
    const totalCopies = await prisma.book.aggregate({
      _sum: { totalCopies: true },
    });

    const availableCopies = await prisma.book.aggregate({
      _sum: { availableCopies: true },
    });

    const languageDistribution = await prisma.book.groupBy({
      by: ["language"],
      _count: {
        language: true,
      },
      orderBy: {
        _count: {
          language: "desc",
        },
      },
    });

    const booksPerAuthor = await prisma.book.groupBy({
      by: ["authorId"],
      _count: {
        authorId: true,
      },
      orderBy: {
        _count: {
          authorId: "desc",
        },
      },
      take: 10,
    });

    const authorDetails = await Promise.all(
      booksPerAuthor.map(async (item) => {
        const author = await prisma.author.findUnique({
          where: { id: item.authorId },
          select: {
            id: true,
            name: true,
            bio: true,
          },
        });
        return {
          ...author,
          bookCount: item._count.authorId,
        };
      }),
    );

    const booksWithLowCopies = await prisma.book.findMany({
      where: {
        availableCopies: {
          lte: 2,
        },
      },
      select: {
        id: true,
        title: true,
        isbn: true,
        totalCopies: true,
        availableCopies: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        availableCopies: "asc",
      },
      take: 20,
    });

    res.status(200).json({
      success: true,
      data: {
        totalCopies: totalCopies._sum.totalCopies || 0,
        availableCopies: availableCopies._sum.availableCopies || 0,
        borrowedCopies:
          (totalCopies._sum.totalCopies || 0) -
          (availableCopies._sum.availableCopies || 0),
        languageDistribution,
        topAuthors: authorDetails,
        booksWithLowCopies,
      },
    });
  } catch (error) {
    console.error("Get book stats error:", error);
    res.status(500).json({ error: "Failed to fetch book statistics" });
  }
});

// Get loan statistics
router.get("/loans/stats", isAdmin, async (_req, res) => {
  try {
    const statusDistribution = await prisma.loan.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const totalFines = await prisma.loan.aggregate({
      where: {
        fine: {
          gt: 0,
        },
      },
      _sum: { fine: true },
      _count: { fine: true },
    });

    const avgLoanDuration = await prisma.$queryRaw`
      SELECT AVG(EXTRACT(DAY FROM ("returnDate" - "borrowDate"))) as avg_duration
      FROM "Loan"
      WHERE "status" = 'returned' AND "returnDate" IS NOT NULL
    `;

    const currentMonthLoans = await prisma.loan.count({
      where: {
        borrowDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const lastMonthLoans = await prisma.loan.count({
      where: {
        borrowDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        statusDistribution,
        totalFinesGenerated: totalFines._sum.fine || 0,
        loansWithFines: totalFines._count.fine || 0,
        averageLoanDuration: avgLoanDuration[0]?.avg_duration || 0,
        currentMonthLoans,
        lastMonthLoans,
        loanGrowth:
          lastMonthLoans > 0
            ? (
                ((currentMonthLoans - lastMonthLoans) / lastMonthLoans) *
                100
              ).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    console.error("Get loan stats error:", error);
    res.status(500).json({ error: "Failed to fetch loan statistics" });
  }
});

export default router;
