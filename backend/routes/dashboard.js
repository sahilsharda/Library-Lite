import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's dashboard data
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get database user from Supabase auth ID
    const dbUser = await prisma.user.findUnique({
      where: { authId: req.user.id }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    // Verify user can access this dashboard
    if (dbUser.id !== userId && dbUser.role !== 'admin' && dbUser.role !== 'librarian') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get member data
    const member = await prisma.member.findUnique({
      where: { userId },
      include: {
        user: true
      }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get loans with calculated fields
    const loans = await prisma.loan.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            author: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { borrowDate: 'desc' }
    });

    // Calculate days remaining and add status flags
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrichedLoans = loans.map(loan => {
      let daysRemaining = null;
      let status = loan.status;

      if (loan.status === 'borrowed' && loan.dueDate) {
        const dueDate = new Date(loan.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining < 0) {
          status = 'overdue';
        }
      }

      return {
        id: loan.id,
        status,
        borrowDate: loan.borrowDate,
        dueDate: loan.dueDate,
        returnDate: loan.returnDate,
        fine: loan.fine,
        daysRemaining,
        book: {
          id: loan.book.id,
          title: loan.book.title,
          author: loan.book.author?.name || 'Unknown',
          isbn: loan.book.isbn
        }
      };
    });

    // Get payments
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        loan: {
          include: {
            book: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: { paymentDate: 'desc' }
    });

    const enrichedPayments = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      paymentDate: payment.paymentDate,
      loan: {
        bookTitle: payment.loan?.book?.title || 'Unknown'
      }
    }));

    // Calculate statistics
    const totalBorrows = loans.length;
    const activeBorrows = enrichedLoans.filter(l => l.status === 'borrowed').length;
    const overdueBorrows = enrichedLoans.filter(l => l.status === 'overdue').length;
    const returnedBorrows = enrichedLoans.filter(l => l.status === 'returned').length;
    
    const totalFines = loans.reduce((sum, loan) => sum + (loan.fine || 0), 0);
    const paidFines = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    // Calculate wallet balance (if membership has initial balance)
    const walletBalance = (member.membership?.initialBalance || 0) - totalFines + paidFines;

    const dashboardData = {
      stats: {
        totalBorrows,
        activeBorrows,
        overdueBorrows,
        returnedBorrows,
        totalFines,
        paidFines,
        walletBalance,
        membershipType: member.membershipType || 'standard',
        memberStatus: member.status
      },
      loans: enrichedLoans,
      payments: enrichedPayments,
      member: {
        id: member.id,
        joinDate: member.createdAt,
        membershipType: member.membershipType,
        status: member.status
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
