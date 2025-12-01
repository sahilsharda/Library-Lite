import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.activityLog.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.loan.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating authors...');
  const authors = await Promise.all([
    prisma.author.create({
      data: {
        name: 'J.K. Rowling',
        bio: 'British author, best known for the Harry Potter series.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'George Orwell',
        bio: 'English novelist and essayist, known for 1984 and Animal Farm.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'Jane Austen',
        bio: 'English novelist known for her six major novels interpreting the British landed gentry.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'F. Scott Fitzgerald',
        bio: 'American novelist, widely regarded as one of the greatest American writers of the 20th century.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'Harper Lee',
        bio: 'American novelist best known for To Kill a Mockingbird.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'J.R.R. Tolkien',
        bio: 'English writer, poet, and philologist, best known for The Lord of the Rings.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'Agatha Christie',
        bio: 'English writer known for her detective novels, especially featuring Hercule Poirot.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'Gabriel García Márquez',
        bio: 'Colombian novelist and Nobel Prize winner, known for magical realism.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'Ernest Hemingway',
        bio: 'American novelist and short-story writer, known for his economical writing style.'
      }
    }),
    prisma.author.create({
      data: {
        name: 'Virginia Woolf',
        bio: 'English writer, considered one of the most important modernist authors.'
      }
    })
  ]);

  console.log(`Created ${authors.length} authors`);

  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: "Harry Potter and the Philosopher's Stone",
        isbn: '978-0-7475-3269-9',
        authorId: authors[0].id,
        publisher: 'Bloomsbury',
        publishedYear: 1997,
        edition: '1st Edition',
        language: 'English',
        pages: 223,
        genre: 'Fantasy, Young Adult, Adventure',
        totalCopies: 5,
        availableCopies: 5,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg',
        description: 'The first novel in the Harry Potter series follows Harry Potter, a young wizard who discovers his magical heritage.',
        tags: 'bestseller, award-winning, series'
      }
    }),
    prisma.book.create({
      data: {
        title: '1984',
        isbn: '978-0-452-28423-4',
        authorId: authors[1].id,
        publisher: 'Secker & Warburg',
        publishedYear: 1949,
        edition: 'Reprint Edition',
        language: 'English',
        pages: 328,
        genre: 'Dystopian, Science Fiction, Political Fiction',
        totalCopies: 4,
        availableCopies: 3,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg',
        description: 'A dystopian social science fiction novel set in a totalitarian society ruled by Big Brother.',
        tags: 'classic, dystopian, must-read'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Pride and Prejudice',
        isbn: '978-0-14-143951-8',
        authorId: authors[2].id,
        publisher: 'T. Egerton',
        publishedYear: 1813,
        edition: 'Penguin Classics',
        language: 'English',
        pages: 432,
        genre: 'Romance, Classic, Fiction',
        totalCopies: 3,
        availableCopies: 2,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
        description: 'A romantic novel of manners following the character development of Elizabeth Bennet.',
        tags: 'classic, romance, british-literature'
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Great Gatsby',
        isbn: '978-0-7432-7356-5',
        authorId: authors[3].id,
        publisher: 'Charles Scribner\'s Sons',
        publishedYear: 1925,
        edition: 'Scribner',
        language: 'English',
        pages: 180,
        genre: 'Fiction, Classic, Literary Fiction',
        totalCopies: 4,
        availableCopies: 4,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
        description: 'A novel set in the Jazz Age that tells the story of Jay Gatsby and his unrequited love.',
        tags: 'classic, american-literature, 1920s'
      }
    }),
    prisma.book.create({
      data: {
        title: 'To Kill a Mockingbird',
        isbn: '978-0-06-112008-4',
        authorId: authors[4].id,
        publisher: 'J.B. Lippincott & Co.',
        publishedYear: 1960,
        edition: 'Harper Perennial Modern Classics',
        language: 'English',
        pages: 324,
        genre: 'Fiction, Classic, Historical Fiction',
        totalCopies: 3,
        availableCopies: 1,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
        description: 'A novel about racial injustice and childhood innocence in the American South.',
        tags: 'classic, pulitzer, civil-rights'
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        isbn: '978-0-618-57498-0',
        authorId: authors[5].id,
        publisher: 'George Allen & Unwin',
        publishedYear: 1954,
        edition: 'Mariner Books',
        language: 'English',
        pages: 398,
        genre: 'Fantasy, Adventure, Epic',
        totalCopies: 5,
        availableCopies: 3,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780618574980-L.jpg',
        description: 'The first volume of the epic fantasy trilogy following Frodo Baggins.',
        tags: 'epic, fantasy, series, adventure'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Murder on the Orient Express',
        isbn: '978-0-06-207348-8',
        authorId: authors[6].id,
        publisher: 'Collins Crime Club',
        publishedYear: 1934,
        edition: 'William Morrow',
        language: 'English',
        pages: 256,
        genre: 'Mystery, Crime, Detective Fiction',
        totalCopies: 3,
        availableCopies: 3,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062073488-L.jpg',
        description: 'Detective Hercule Poirot investigates a murder aboard the famous train.',
        tags: 'mystery, detective, classic'
      }
    }),
    prisma.book.create({
      data: {
        title: 'One Hundred Years of Solitude',
        isbn: '978-0-06-088328-7',
        authorId: authors[7].id,
        publisher: 'Harper & Row',
        publishedYear: 1967,
        edition: 'Harper Perennial',
        language: 'English',
        pages: 417,
        genre: 'Literary Fiction, Magical Realism, Classic',
        totalCopies: 2,
        availableCopies: 2,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg',
        description: 'A landmark novel chronicling seven generations of the Buendía family.',
        tags: 'magical-realism, classic, latin-american'
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Old Man and the Sea',
        isbn: '978-0-684-80122-3',
        authorId: authors[8].id,
        publisher: 'Charles Scribner\'s Sons',
        publishedYear: 1952,
        edition: 'Scribner',
        language: 'English',
        pages: 127,
        genre: 'Fiction, Classic, Adventure',
        totalCopies: 3,
        availableCopies: 3,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780684801223-L.jpg',
        description: 'The story of an aging Cuban fisherman and his epic battle with a giant marlin.',
        tags: 'classic, pulitzer, novella'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Mrs Dalloway',
        isbn: '978-0-15-662870-9',
        authorId: authors[9].id,
        publisher: 'Hogarth Press',
        publishedYear: 1925,
        edition: 'Harcourt',
        language: 'English',
        pages: 194,
        genre: 'Literary Fiction, Modernist, Classic',
        totalCopies: 2,
        availableCopies: 2,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780156628709-L.jpg',
        description: 'A modernist novel detailing a day in the life of Clarissa Dalloway in post-WWI England.',
        tags: 'modernist, stream-of-consciousness, classic'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Animal Farm',
        isbn: '978-0-452-28424-1',
        authorId: authors[1].id,
        publisher: 'Secker & Warburg',
        publishedYear: 1945,
        edition: 'Signet Classics',
        language: 'English',
        pages: 112,
        genre: 'Political Fiction, Satire, Allegory',
        totalCopies: 4,
        availableCopies: 4,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780452284241-L.jpg',
        description: 'An allegorical novella reflecting events leading up to the Russian Revolution.',
        tags: 'classic, political, satire'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Harry Potter and the Chamber of Secrets',
        isbn: '978-0-439-06486-6',
        authorId: authors[0].id,
        publisher: 'Bloomsbury',
        publishedYear: 1998,
        edition: 'Scholastic',
        language: 'English',
        pages: 251,
        genre: 'Fantasy, Young Adult, Adventure',
        totalCopies: 4,
        availableCopies: 3,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780439064866-L.jpg',
        description: 'Harry returns to Hogwarts for his second year to face a mysterious monster.',
        tags: 'bestseller, series, young-adult'
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Hobbit',
        isbn: '978-0-618-00221-3',
        authorId: authors[5].id,
        publisher: 'George Allen & Unwin',
        publishedYear: 1937,
        edition: 'Mariner Books',
        language: 'English',
        pages: 310,
        genre: 'Fantasy, Adventure, Children\'s Literature',
        totalCopies: 4,
        availableCopies: 4,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780618002214-L.jpg',
        description: 'Bilbo Baggins embarks on an unexpected journey to reclaim treasure from a dragon.',
        tags: 'fantasy, adventure, prequel'
      }
    }),
    prisma.book.create({
      data: {
        title: 'Sense and Sensibility',
        isbn: '978-0-14-143966-2',
        authorId: authors[2].id,
        publisher: 'T. Egerton',
        publishedYear: 1811,
        edition: 'Penguin Classics',
        language: 'English',
        pages: 409,
        genre: 'Romance, Classic, Fiction',
        totalCopies: 2,
        availableCopies: 2,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439662-L.jpg',
        description: 'A story about the Dashwood sisters navigating love, heartbreak, and society.',
        tags: 'classic, romance, british-literature'
      }
    }),
    prisma.book.create({
      data: {
        title: 'And Then There Were None',
        isbn: '978-0-06-207349-5',
        authorId: authors[6].id,
        publisher: 'Collins Crime Club',
        publishedYear: 1939,
        edition: 'William Morrow',
        language: 'English',
        pages: 272,
        genre: 'Mystery, Crime, Thriller',
        totalCopies: 3,
        availableCopies: 2,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062073495-L.jpg',
        description: 'Ten strangers are lured to an island where they are mysteriously murdered one by one.',
        tags: 'mystery, thriller, bestseller'
      }
    })
  ]);

  console.log(`Created ${books.length} books`);

  console.log('Creating test users...');
  const testUsers = [];

  // Helper function to create or get user
  const createOrGetUser = async (userData) => {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existing) {
      console.log(`User ${userData.email} already exists`);
      return existing;
    }

    return await prisma.user.create({ data: userData });
  };

  // Create admin user
  const adminUser = await createOrGetUser({
    email: 'admin@library.com',
    fullName: 'Admin User',
    name: 'Admin',
    authId: `auth-admin-${Date.now()}`,
    role: 'admin',
    phone: '+1234567890',
    address: '123 Library Street, Book City, BC 12345'
  });
  testUsers.push(adminUser);
  console.log('Admin user ready');

  // Create librarian user
  const librarianUser = await createOrGetUser({
    email: 'librarian@library.com',
    fullName: 'Sarah Johnson',
    name: 'Sarah',
    authId: `auth-librarian-${Date.now()}`,
    role: 'librarian',
    phone: '+1234567891',
    address: '456 Book Avenue, Library Town, LT 23456'
  });
  testUsers.push(librarianUser);
  console.log('Librarian user ready');

  // Create member users
  const memberData = [
    { email: 'john.doe@example.com', fullName: 'John Doe', name: 'John', phone: '+1234567892', address: '789 Reader Lane, Book City, BC 34567' },
    { email: 'jane.smith@example.com', fullName: 'Jane Smith', name: 'Jane', phone: '+1234567893', address: '321 Novel Street, Story Town, ST 45678' },
    { email: 'mike.wilson@example.com', fullName: 'Mike Wilson', name: 'Mike', phone: '+1234567894', address: '654 Chapter Road, Fiction City, FC 56789' },
    { email: 'emily.brown@example.com', fullName: 'Emily Brown', name: 'Emily', phone: '+1234567895', address: '987 Page Boulevard, Read City, RC 67890' },
    { email: 'david.lee@example.com', fullName: 'David Lee', name: 'David', phone: '+1234567896', address: '147 Bookmark Drive, Library City, LC 78901' }
  ];

  for (const data of memberData) {
    const memberUser = await createOrGetUser({
      email: data.email,
      fullName: data.fullName,
      name: data.name,
      authId: `auth-${data.email.split('@')[0]}-${Date.now()}`,
      role: 'member',
      phone: data.phone,
      address: data.address
    });
    testUsers.push(memberUser);
  }

  console.log(`Created/verified ${testUsers.length} users`);

  console.log('Creating memberships...');
  const members = [];
  for (let i = 2; i < testUsers.length; i++) {
    const membershipTypes = ['basic', 'premium', 'student'];
    const membershipType = membershipTypes[(i - 2) % 3];
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const existing = await prisma.member.findUnique({
      where: { userId: testUsers[i].id }
    });

    if (!existing) {
      const member = await prisma.member.create({
        data: {
          userId: testUsers[i].id,
          membershipType: membershipType,
          expiryDate: expiryDate,
          status: 'active'
        }
      });
      members.push(member);
    } else {
      members.push(existing);
      console.log(`Membership for user ${testUsers[i].email} already exists`);
    }
  }

  console.log(`Created/verified ${members.length} memberships`);

  console.log('Creating loans...');
  const loans = [];

  // Create some active loans
  const loan1 = await prisma.loan.create({
    data: {
      userId: testUsers[2].id,
      bookId: books[1].id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'borrowed'
    }
  });
  loans.push(loan1);

  const loan2 = await prisma.loan.create({
    data: {
      userId: testUsers[3].id,
      bookId: books[2].id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'borrowed'
    }
  });
  loans.push(loan2);

  const loan3 = await prisma.loan.create({
    data: {
      userId: testUsers[4].id,
      bookId: books[4].id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'borrowed'
    }
  });
  loans.push(loan3);

  const loan4 = await prisma.loan.create({
    data: {
      userId: testUsers[5].id,
      bookId: books[5].id,
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      status: 'borrowed'
    }
  });
  loans.push(loan4);

  const loan5 = await prisma.loan.create({
    data: {
      userId: testUsers[6].id,
      bookId: books[11].id,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      status: 'borrowed'
    }
  });
  loans.push(loan5);

  // Create an overdue loan
  const overdueLoan = await prisma.loan.create({
    data: {
      userId: testUsers[3].id,
      bookId: books[4].id,
      borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'borrowed',
      fine: 25.0
    }
  });
  loans.push(overdueLoan);

  // Create some returned loans
  const returnedLoan1 = await prisma.loan.create({
    data: {
      userId: testUsers[2].id,
      bookId: books[0].id,
      borrowDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'returned'
    }
  });
  loans.push(returnedLoan1);

  const returnedLoan2 = await prisma.loan.create({
    data: {
      userId: testUsers[4].id,
      bookId: books[6].id,
      borrowDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'returned'
    }
  });
  loans.push(returnedLoan2);

  // Update book availability
  await prisma.book.update({
    where: { id: books[1].id },
    data: { availableCopies: 3 }
  });

  await prisma.book.update({
    where: { id: books[2].id },
    data: { availableCopies: 1 }
  });

  await prisma.book.update({
    where: { id: books[4].id },
    data: { availableCopies: 0 }
  });

  await prisma.book.update({
    where: { id: books[5].id },
    data: { availableCopies: 2 }
  });

  await prisma.book.update({
    where: { id: books[11].id },
    data: { availableCopies: 2 }
  });

  await prisma.book.update({
    where: { id: books[14].id },
    data: { availableCopies: 1 }
  });

  console.log(`Created ${loans.length} loans`);

  console.log('Creating reservations...');
  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        userId: testUsers[5].id,
        bookId: books[4].id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    }),
    prisma.reservation.create({
      data: {
        userId: testUsers[6].id,
        bookId: books[4].id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    })
  ]);

  console.log(`Created ${reservations.length} reservations`);

  console.log('Creating payments...');
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        loanId: overdueLoan.id,
        userId: testUsers[3].id,
        amount: 25.0,
        paymentMethod: 'cash',
        status: 'completed',
        transactionId: 'TXN001'
      }
    })
  ]);

  console.log(`Created ${payments.length} payments`);

  console.log('Creating activity logs...');
  const activityLogs = [];

  for (const loan of loans) {
    if (loan.status === 'borrowed') {
      const book = books.find(b => b.id === loan.bookId);
      await prisma.activityLog.create({
        data: {
          userId: loan.userId,
          action: 'BORROW_BOOK',
          resourceType: 'loan',
          resourceId: loan.id.toString(),
          meta: {
            bookTitle: book?.title,
            bookIsbn: book?.isbn
          }
        }
      });
      activityLogs.push('BORROW_BOOK');
    } else if (loan.status === 'returned') {
      const book = books.find(b => b.id === loan.bookId);
      await prisma.activityLog.create({
        data: {
          userId: loan.userId,
          action: 'RETURN_BOOK',
          resourceType: 'loan',
          resourceId: loan.id.toString(),
          meta: {
            bookTitle: book?.title,
            bookIsbn: book?.isbn
          }
        }
      });
      activityLogs.push('RETURN_BOOK');
    }
  }

  for (const reservation of reservations) {
    const book = books.find(b => b.id === reservation.bookId);
    await prisma.activityLog.create({
      data: {
        userId: reservation.userId,
        action: 'RESERVE_BOOK',
        resourceType: 'reservation',
        resourceId: reservation.id.toString(),
        meta: {
          bookTitle: book?.title,
          bookIsbn: book?.isbn
        }
      }
    });
    activityLogs.push('RESERVE_BOOK');
  }

  for (const payment of payments) {
    await prisma.activityLog.create({
      data: {
        userId: payment.userId,
        action: 'PAY_FINE',
        resourceType: 'payment',
        resourceId: payment.id.toString(),
        meta: {
          amount: payment.amount,
          paymentMethod: payment.paymentMethod
        }
      }
    });
    activityLogs.push('PAY_FINE');
  }

  console.log(`Created ${activityLogs.length} activity logs`);

  console.log('\nDatabase seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`   - ${authors.length} authors`);
  console.log(`   - ${books.length} books`);
  console.log(`   - ${testUsers.length} users (1 admin, 1 librarian, ${testUsers.length - 2} members)`);
  console.log(`   - ${members.length} memberships`);
  console.log(`   - ${loans.length} loans (${loans.filter(l => l.status === 'borrowed').length} active, ${loans.filter(l => l.status === 'returned').length} returned)`);
  console.log(`   - ${reservations.length} reservations`);
  console.log(`   - ${payments.length} payments`);
  console.log(`   - ${activityLogs.length} activity logs`);

  console.log('\nTest User Emails:');
  console.log('   Admin: admin@library.com');
  console.log('   Librarian: librarian@library.com');
  console.log('   Members: john.doe@example.com');
  console.log('            jane.smith@example.com');
  console.log('            mike.wilson@example.com');
  console.log('            emily.brown@example.com');
  console.log('            david.lee@example.com');
  console.log('\nNote: Use your existing authentication system to log in with these users.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
