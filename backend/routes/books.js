import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { isLibrarian, isAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// Get all books with search and filters
router.get('/', async (req, res) => {
  try {
    const {
      search,
      genre,
      author,
      language,
      available,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
        { publisher: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (genre) {
      where.genre = { contains: genre };
    }

    if (author) {
      where.author = {
        name: { contains: author, mode: 'insensitive' }
      };
    }

    if (language) {
      where.language = language;
    }

    if (available === 'true') {
      where.availableCopies = { gt: 0 };
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true
            }
          }
        },
        skip,
        take,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.book.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            bio: true
          }
        },
        loans: {
          where: { status: 'borrowed' },
          select: {
            id: true,
            borrowDate: true,
            dueDate: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Create new book
router.post('/', isLibrarian, async (req, res) => {
  try {
    const {
      title,
      isbn,
      authorId,
      publisher,
      publishedYear,
      edition,
      language,
      pages,
      genre,
      totalCopies,
      coverUrl,
      description,
      tags
    } = req.body;

    if (!title || !isbn || !authorId) {
      return res.status(400).json({
        error: 'Title, ISBN, and Author ID are required'
      });
    }

    const existingBook = await prisma.book.findUnique({
      where: { isbn }
    });

    if (existingBook) {
      return res.status(400).json({
        error: 'Book with this ISBN already exists'
      });
    }

    const copies = parseInt(totalCopies) || 1;

    const book = await prisma.book.create({
      data: {
        title,
        isbn,
        authorId: parseInt(authorId),
        publisher,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        edition,
        language: language || 'English',
        pages: pages ? parseInt(pages) : null,
        genre: genre || [],
        totalCopies: copies,
        availableCopies: copies,
        coverUrl,
        description,
        tags: tags || []
      },
      include: {
        author: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Update book
router.put('/:id', isLibrarian, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      isbn,
      authorId,
      publisher,
      publishedYear,
      edition,
      language,
      pages,
      genre,
      totalCopies,
      availableCopies,
      coverUrl,
      description,
      tags
    } = req.body;

    const existingBook = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (isbn && isbn !== existingBook.isbn) {
      const duplicateIsbn = await prisma.book.findUnique({
        where: { isbn }
      });
      if (duplicateIsbn) {
        return res.status(400).json({
          error: 'Another book with this ISBN already exists'
        });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (authorId !== undefined) updateData.authorId = parseInt(authorId);
    if (publisher !== undefined) updateData.publisher = publisher;
    if (publishedYear !== undefined) updateData.publishedYear = parseInt(publishedYear);
    if (edition !== undefined) updateData.edition = edition;
    if (language !== undefined) updateData.language = language;
    if (pages !== undefined) updateData.pages = parseInt(pages);
    if (genre !== undefined) updateData.genre = genre;
    if (totalCopies !== undefined) updateData.totalCopies = parseInt(totalCopies);
    if (availableCopies !== undefined) updateData.availableCopies = parseInt(availableCopies);
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;

    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        author: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        loans: {
          where: {
            status: { in: ['borrowed', 'overdue'] }
          }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.loans.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete book with active loans'
      });
    }

    await prisma.book.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;
