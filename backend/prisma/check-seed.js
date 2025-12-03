import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function checkSeedData() {
  console.log("Checking seeded data...\n");

  try {
    // Count all records
    const [
      authorCount,
      bookCount,
      userCount,
      memberCount,
      loanCount,
      reservationCount,
      paymentCount,
      activityLogCount,
    ] = await Promise.all([
      prisma.author.count(),
      prisma.book.count(),
      prisma.user.count(),
      prisma.member.count(),
      prisma.loan.count(),
      prisma.reservation.count(),
      prisma.payment.count(),
      prisma.activityLog.count(),
    ]);

    console.log("=== Record Counts ===");
    console.log(`Authors: ${authorCount}`);
    console.log(`Books: ${bookCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Members: ${memberCount}`);
    console.log(`Loans: ${loanCount}`);
    console.log(`Reservations: ${reservationCount}`);
    console.log(`Payments: ${paymentCount}`);
    console.log(`Activity Logs: ${activityLogCount}`);

    // Get authors
    console.log("\n=== Authors ===");
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });
    authors.forEach((author) => {
      console.log(`- ${author.name} (${author._count.books} books)`);
    });

    // Get books with availability
    console.log("\n=== Books (Availability) ===");
    const books = await prisma.book.findMany({
      orderBy: { title: "asc" },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
    books.forEach((book) => {
      const status =
        book.availableCopies === 0
          ? "❌ All borrowed"
          : book.availableCopies < book.totalCopies
            ? `⚠️  ${book.availableCopies}/${book.totalCopies} available`
            : `✅ ${book.availableCopies}/${book.totalCopies} available`;
      console.log(`- ${book.title} by ${book.author.name}`);
      console.log(`  ${status} | ISBN: ${book.isbn}`);
    });

    // Get users by role
    console.log("\n=== Users by Role ===");
    const users = await prisma.user.findMany({
      orderBy: [{ role: "asc" }, { fullName: "asc" }],
      include: {
        member: true,
      },
    });

    const usersByRole = users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {});

    Object.entries(usersByRole).forEach(([role, roleUsers]) => {
      console.log(`\n${role.toUpperCase()}:`);
      roleUsers.forEach((user) => {
        const memberInfo = user.member
          ? ` (${user.member.membershipType} membership)`
          : "";
        console.log(`- ${user.fullName} <${user.email}>${memberInfo}`);
      });
    });

    // Get active loans
    console.log("\n=== Active Loans ===");
    const activeLoans = await prisma.loan.findMany({
      where: {
        status: { in: ["borrowed", "overdue"] },
      },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        book: {
          select: { title: true, author: { select: { name: true } } },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    if (activeLoans.length === 0) {
      console.log("No active loans");
    } else {
      activeLoans.forEach((loan) => {
        const today = new Date();
        const dueDate = new Date(loan.dueDate);
        const daysUntilDue = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24),
        );

        let status;
        if (daysUntilDue < 0) {
          status = `🔴 OVERDUE by ${Math.abs(daysUntilDue)} days (Fine: $${loan.fine || Math.abs(daysUntilDue) * 5})`;
        } else if (daysUntilDue <= 3) {
          status = `🟡 Due in ${daysUntilDue} days`;
        } else {
          status = `🟢 Due in ${daysUntilDue} days`;
        }

        console.log(`\n- ${loan.user.fullName} borrowed "${loan.book.title}"`);
        console.log(`  by ${loan.book.author.name}`);
        console.log(`  ${status}`);
        console.log(`  Borrowed: ${loan.borrowDate.toLocaleDateString()}`);
        console.log(`  Due: ${loan.dueDate.toLocaleDateString()}`);
      });
    }

    // Get reservations
    console.log("\n=== Reservations ===");
    const reservations = await prisma.reservation.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        book: {
          select: { title: true, availableCopies: true },
        },
      },
      orderBy: { reservedAt: "asc" },
    });

    if (reservations.length === 0) {
      console.log("No pending reservations");
    } else {
      reservations.forEach((reservation) => {
        const expiresAt = new Date(reservation.expiresAt);
        const daysUntilExpiry = Math.ceil(
          (expiresAt - new Date()) / (1000 * 60 * 60 * 24),
        );
        console.log(
          `- ${reservation.user.fullName} reserved "${reservation.book.title}"`,
        );
        console.log(
          `  Reserved: ${reservation.reservedAt.toLocaleDateString()}`,
        );
        console.log(`  Expires in: ${daysUntilExpiry} days`);
        console.log(
          `  Book availability: ${reservation.book.availableCopies} copies`,
        );
      });
    }

    // Get payments
    console.log("\n=== Payments ===");
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: { fullName: true },
        },
        loan: {
          select: {
            book: {
              select: { title: true },
            },
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });

    if (payments.length === 0) {
      console.log("No payments recorded");
    } else {
      payments.forEach((payment) => {
        console.log(`- ${payment.user.fullName} paid $${payment.amount}`);
        console.log(`  For: "${payment.loan.book.title}"`);
        console.log(
          `  Method: ${payment.paymentMethod} | Status: ${payment.status}`,
        );
        console.log(`  Date: ${payment.paymentDate.toLocaleDateString()}`);
      });
    }

    // Get recent activity
    console.log("\n=== Recent Activity (Last 10) ===");
    const recentActivity = await prisma.activityLog.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: { fullName: true },
        },
      },
    });

    recentActivity.forEach((log) => {
      console.log(`- ${log.timestamp.toLocaleString()}`);
      console.log(`  ${log.user.fullName}: ${log.action}`);
      if (log.meta && typeof log.meta === "object") {
        const meta = log.meta;
        if (meta.bookTitle) console.log(`  Book: ${meta.bookTitle}`);
        if (meta.amount) console.log(`  Amount: $${meta.amount}`);
      }
    });

    // Statistics
    console.log("\n=== Statistics ===");
    const borrowedLoans = await prisma.loan.count({
      where: { status: "borrowed" },
    });
    const returnedLoans = await prisma.loan.count({
      where: { status: "returned" },
    });
    const overdueLoans = await prisma.loan.count({
      where: {
        status: "borrowed",
        dueDate: { lt: new Date() },
      },
    });
    const totalFines = await prisma.payment.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    console.log(`Total Loans: ${borrowedLoans + returnedLoans}`);
    console.log(`- Active: ${borrowedLoans}`);
    console.log(`- Returned: ${returnedLoans}`);
    console.log(`- Overdue: ${overdueLoans}`);
    console.log(`Total Fines Collected: $${totalFines._sum.amount || 0}`);

    console.log("\n✅ Seed data verification complete!");
  } catch (error) {
    console.error("Error checking seed data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeedData();
