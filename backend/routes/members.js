import express from "express";
import prisma from "../prisma/prismaClient.js";
import { isLibrarian, isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// Get all members
router.get("/", isLibrarian, async (req, res) => {
  try {
    const {
      search,
      status,
      membershipType,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (search) {
      where.user = {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (status) {
      where.status = status;
    }

    if (membershipType) {
      where.membershipType = membershipType;
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              name: true,
              phone: true,
              address: true,
              role: true,
              createdAt: true,
            },
          },
        },
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.member.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Get member by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
            phone: true,
            address: true,
            role: true,
            createdAt: true,
            loans: {
              include: {
                book: {
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
                },
              },
              orderBy: {
                borrowDate: "desc",
              },
              take: 10,
            },
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Get member error:", error);
    res.status(500).json({ error: "Failed to fetch member" });
  }
});

// Create new member
router.post("/", isLibrarian, async (req, res) => {
  try {
    const { userId, membershipType, expiryDate } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const existingMember = await prisma.member.findUnique({
      where: { userId },
    });

    if (existingMember) {
      return res.status(400).json({
        error: "User already has a membership",
      });
    }

    const member = await prisma.member.create({
      data: {
        userId,
        membershipType: membershipType || "basic",
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: "active",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member,
    });
  } catch (error) {
    console.error("Create member error:", error);
    res.status(500).json({ error: "Failed to create member" });
  }
});

// Update member
router.put("/:id", isLibrarian, async (req, res) => {
  try {
    const { id } = req.params;
    const { membershipType, startDate, expiryDate, status } = req.body;

    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return res.status(404).json({ error: "Member not found" });
    }

    const updateData = {};
    if (membershipType !== undefined)
      updateData.membershipType = membershipType;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (expiryDate !== undefined)
      updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (status !== undefined) updateData.status = status;

    const member = await prisma.member.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (error) {
    console.error("Update member error:", error);
    res.status(500).json({ error: "Failed to update member" });
  }
});

// Delete member
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            loans: {
              where: {
                status: { in: ["borrowed", "overdue"] },
              },
            },
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    if (member.user.loans.length > 0) {
      return res.status(400).json({
        error: "Cannot delete member with active loans",
      });
    }

    await prisma.member.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

export default router;
