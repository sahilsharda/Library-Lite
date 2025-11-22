import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { isLibrarian } from '../middleware/roleCheck.js';

const router = express.Router();

// Get all payments
router.get('/', isLibrarian, async (req, res) => {
  try {
    const {
      userId,
      loanId,
      status,
      page = 1,
      limit = 20,
      sortBy = 'paymentDate',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (userId) where.userId = userId;
    if (loanId) where.loanId = loanId;
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              name: true
            }
          },
          loan: {
            select: {
              id: true,
              book: {
                select: {
                  title: true,
                  isbn: true
                }
              },
              borrowDate: true,
              returnDate: true
            }
          }
        },
        skip,
        take,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.payment.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
            phone: true
          }
        },
        loan: {
          select: {
            id: true,
            book: {
              select: {
                title: true,
                isbn: true,
                author: {
                  select: {
                    name: true
                  }
                }
              }
            },
            borrowDate: true,
            dueDate: true,
            returnDate: true,
            fine: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Process fine payment
router.post('/payfine', isLibrarian, async (req, res) => {
  try {
    const {
      userId,
      loanId,
      amount,
      paymentMethod = 'cash',
      transactionId
    } = req.body;

    if (!userId || !loanId || !amount) {
      return res.status(400).json({
        error: 'User ID, Loan ID, and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than zero'
      });
    }

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        book: {
          select: {
            title: true
          }
        }
      }
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.userId !== userId) {
      return res.status(403).json({
        error: 'Unauthorized: Loan does not belong to this user'
      });
    }

    if (!loan.fine || loan.fine <= 0) {
      return res.status(400).json({
        error: 'No fine associated with this loan'
      });
    }

    if (amount > loan.fine) {
      return res.status(400).json({
        error: `Amount exceeds the fine. Fine amount: $${loan.fine}`
      });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        loanId,
        status: 'completed'
      }
    });

    if (existingPayment) {
      return res.status(400).json({
        error: 'Fine for this loan has already been paid'
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        loanId,
        amount,
        paymentMethod,
        transactionId,
        status: 'completed'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true
          }
        },
        loan: {
          select: {
            id: true,
            book: {
              select: {
                title: true,
                isbn: true
              }
            },
            fine: true
          }
        }
      }
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'PAY_FINE',
        details: `Paid fine of $${amount} for book: ${loan.book.title}`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Fine paid successfully',
      data: payment
    });
  } catch (error) {
    console.error('Pay fine error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Get user payment history
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        loan: {
          select: {
            id: true,
            book: {
              select: {
                title: true,
                isbn: true
              }
            },
            borrowDate: true,
            returnDate: true,
            fine: true
          }
        }
      },
      orderBy: {
        paymentDate: 'desc'
      }
    });

    const totalPaid = payments.reduce((sum, payment) => {
      return payment.status === 'completed' ? sum + payment.amount : sum;
    }, 0);

    res.status(200).json({
      success: true,
      data: payments,
      total: payments.length,
      totalPaid
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ error: 'Failed to fetch user payments' });
  }
});

export default router;
