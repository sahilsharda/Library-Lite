import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Update user profile
router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, phone, address } = req.body;

    // Get database user from Supabase auth ID
    const dbUser = await prisma.user.findUnique({
      where: { authId: req.user.id }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    // Verify user can update this profile
    if (dbUser.id !== userId && dbUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        name: true,
        phone: true,
        address: true,
        role: true,
      }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get database user from Supabase auth ID
    const dbUser = await prisma.user.findUnique({
      where: { authId: req.user.id }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    // Verify user can access this profile
    if (dbUser.id !== userId && dbUser.role !== 'admin' && dbUser.role !== 'librarian') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
