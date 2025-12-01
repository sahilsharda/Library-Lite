import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { isLibrarian } from '../middleware/roleCheck.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const FINE_PER_DAY = 5;

// Get all loans
router.get('/', isLibrarian, async (req, res) => {
  try {
    const {
      userId,
      bookId,
      status,
      page = 1,
      limit = 20,
      sortBy = 'borrowDate',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (userId) where.userId = userId;
    if (bookId) where.bookId = bookId;
    if (status) where.status = status;

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
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
        skip,
        take,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.loan.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: loans,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

// Get overdue loans
router.get('/overdue', isLibrarian, async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueLoans = await prisma.loan.findMany({
      where: {
        status: 'borrowed',
        dueDate: {
          lt: today
        }
      },
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
      orderBy: {
        dueDate: 'asc'
      }
    });

    const loansWithFines = overdueLoans.map(loan => {
      const daysOverdue = Math.floor((today - loan.dueDate) / (1000 * 60 * 60 * 24));
      const calculatedFine = daysOverdue * FINE_PER_DAY;
      return {
        ...loan,
        daysOverdue,
        calculatedFine
      };
    });

    res.status(200).json({
      success: true,
      data: loansWithFines,
      total: loansWithFines.length
    });
  } catch (error) {
    console.error('Get overdue loans error:', error);
    res.status(500).json({ error: 'Failed to fetch overdue loans' });
  }
});

// Get my loans (for authenticated members)
router.get('/my-loans', authenticateToken, async (req, res) => {
  try {
    // Get database user from Supabase auth ID
    const dbUser = await prisma.user.findUnique({
      where: { authId: req.user.id }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const loans = await prisma.loan.findMany({
      where: { userId: dbUser.id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            coverUrl: true,
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

    res.status(200).json({
      success: true,
      data: loans
    });
  } catch (error) {
    console.error('Get my loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

// Member borrow a book (authenticated member can borrow for themselves)
router.post('/borrow', authenticateToken, async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;

    // Get database user from Supabase auth ID
    const dbUser = await prisma.user.findUnique({
      where: { authId: req.user.id }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userId = dbUser.id;

    if (!bookId) {
      return res.status(400).json({
        error: 'Book ID is required'
      });
    }

    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        error: 'No copies available for borrowing'
      });
    }

    const activeLoans = await prisma.loan.count({
      where: {
        userId,
        bookId: parseInt(bookId),
        status: { in: ['borrowed', 'overdue'] }
      }
    });

    if (activeLoans > 0) {
      return res.status(400).json({
        error: 'You already have an active loan for this book'
      });
    }

    const calculatedDueDate = dueDate
      ? new Date(dueDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const [loan] = await prisma.$transaction([
      prisma.loan.create({
        data: {
          userId,
          bookId: parseInt(bookId),
          dueDate: calculatedDueDate,
          status: 'borrowed'
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
        }
      }),
      prisma.book.update({
        where: { id: parseInt(bookId) },
        data: {
          availableCopies: {
            decrement: 1
          }
        }
      })
    ]);

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'BORROW_BOOK',
        resourceType: 'LOAN',
        resourceId: loan.id.toString()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: loan
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({ error: 'Failed to borrow book' });
  }
});

// Return a book (members can return their own books)
router.post('/return', authenticateToken, async (req, res) => {
  try {
    const { loanId } = req.body;

    if (!loanId) {
      return res.status(400).json({
        error: 'Loan ID is required'
      });
    }

    // Get database user from Supabase auth ID
    const dbUser = await prisma.user.findUnique({
      where: { authId: req.user.id }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const loan = await prisma.loan.findUnique({
      where: { id: parseInt(loanId) },
      include: {
        book: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true
          }
        }
      }
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check if user owns this loan (unless they're admin/librarian)
    if (loan.userId !== dbUser.id && dbUser.role !== 'admin' && dbUser.role !== 'librarian') {
      return res.status(403).json({ error: 'You can only return your own borrowed books' });
    }

    if (loan.status === 'returned') {
      return res.status(400).json({
        error: 'Book has already been returned'
      });
    }

    const today = new Date();
    const isOverdue = today > loan.dueDate;
    let fine = 0;

    if (isOverdue) {
      const daysOverdue = Math.floor((today - loan.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysOverdue * FINE_PER_DAY;
    }

    const [updatedLoan] = await prisma.$transaction([
      prisma.loan.update({
        where: { id: parseInt(loanId) },
        data: {
          returnDate: today,
          status: 'returned',
          fine: fine
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
        }
      }),
      prisma.book.update({
        where: { id: loan.bookId },
        data: {
          availableCopies: {
            increment: 1
          }
        }
      })
    ]);

    await prisma.activityLog.create({
      data: {
        userId: loan.userId,
        action: 'RETURN_BOOK',
        resourceType: 'LOAN',
        resourceId: loan.id.toString()
      }
    });

    res.status(200).json({
      success: true,
      message: fine > 0 ? `Book returned with fine: $${fine}` : 'Book returned successfully',
      data: {
        loan: updatedLoan,
        fine
      }
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

// Reserve a book
router.post('/reserve', async (req, res) => {
  try {
    const { userId, bookId, expiryDate } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({
        error: 'User ID and Book ID are required'
      });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId,
        bookId,
        status: 'pending'
      }
    });

    if (existingReservation) {
      return res.status(400).json({
        error: 'You already have a pending reservation for this book'
      });
    }

    const calculatedExpiryDate = expiryDate
      ? new Date(expiryDate)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookId,
        expiryDate: calculatedExpiryDate,
        status: 'pending'
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
      }
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'RESERVE_BOOK',
        details: `Reserved book: ${book.title}`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Book reserved successfully',
      data: reservation
    });
  } catch (error) {
    console.error('Reserve book error:', error);
    res.status(500).json({ error: 'Failed to reserve book' });
  }
});

// Get user reservations
router.get('/reservations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const where = { userId };
    if (status) where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            availableCopies: true,
            author: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        reservedDate: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: reservations,
      total: reservations.length
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Cancel reservation
router.delete('/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            title: true
          }
        }
      }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    await prisma.reservation.update({
      where: { id },
      data: {
        status: 'cancelled'
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: reservation.userId,
        action: 'CANCEL_RESERVATION',
        details: `Cancelled reservation for: ${reservation.book.title}`
      }
    });

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

export default router;
