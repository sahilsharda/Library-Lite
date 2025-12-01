import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Google Books API configuration
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const SEARCH_QUERIES = [
  'fiction bestseller', 'science fiction classic', 'fantasy adventure', 'mystery thriller', 
  'romance novel', 'horror stephen king', 'biography', 'history world war', 
  'science physics', 'technology programming', 'self help productivity', 
  'business management', 'philosophy ethics', 'psychology mindfulness', 'cooking recipes'
];

// Fetch books from Google Books API
async function fetchBooksFromGoogle(query, maxResults = 10) {
  try {
    const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=relevance&langRestrict=en`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching books for query "${query}":`, error.message);
    return [];
  }
}

// Extract ISBN from identifiers
function extractISBN(identifiers) {
  if (!identifiers || identifiers.length === 0) {
    return `GBOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
  const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
  return isbn13?.identifier || isbn10?.identifier || `GBOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Extract year from published date
function extractYear(publishedDate) {
  if (!publishedDate) return null;
  const year = parseInt(publishedDate.split('-')[0]);
  return Number.isNaN(year) ? null : year;
}

// Get or create author
async function getOrCreateAuthor(authorName, bio = null) {
  let author = await prisma.author.findFirst({
    where: { name: authorName }
  });

  if (!author) {
    author = await prisma.author.create({
      data: {
        name: authorName,
        bio: bio
      }
    });
    console.log(`   ✓ Created author: ${authorName}`);
  }

  return author;
}

// Process and store a book from Google Books API
async function processGoogleBook(item, existingISBNs) {
  const volumeInfo = item.volumeInfo;
  
  // Skip if no title
  if (!volumeInfo.title) return null;
  
  // Extract data
  const isbn = extractISBN(volumeInfo.industryIdentifiers);
  
  // Skip if ISBN already exists
  if (existingISBNs.has(isbn)) {
    return null;
  }
  
  const authorName = volumeInfo.authors && volumeInfo.authors.length > 0 
    ? volumeInfo.authors[0] 
    : 'Unknown Author';
  
  const publishedYear = extractYear(volumeInfo.publishedDate);
  const pageCount = volumeInfo.pageCount || null;
  const categories = volumeInfo.categories || [];
  const language = volumeInfo.language || 'en';
  const imageUrl = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || null;
  const description = volumeInfo.description || 'No description available';
  
  // Get or create author
  const author = await getOrCreateAuthor(authorName);
  
  // Determine availability
  const totalCopies = Math.floor(Math.random() * 5) + 1; // 1-5 copies
  const availableCopies = Math.floor(Math.random() * totalCopies) + 1; // At least 1 available
  
  try {
    const book = await prisma.book.create({
      data: {
        title: volumeInfo.title.substring(0, 255), // Limit title length
        isbn: isbn,
        authorId: author.id,
        publisher: volumeInfo.publisher?.substring(0, 255) || null,
        publishedYear: publishedYear,
        language: language,
        pages: pageCount,
        genre: categories.slice(0, 5), // Limit to 5 genres
        totalCopies: totalCopies,
        availableCopies: availableCopies,
        coverUrl: imageUrl,
        description: description.substring(0, 2000), // Limit description length
        tags: categories.slice(0, 10) // Limit to 10 tags
      }
    });
    
    existingISBNs.add(isbn);
    return book;
  } catch (error) {
    console.error(`   ✗ Error creating book "${volumeInfo.title}":`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting database seeding with Google Books API...\n');

  // Clear existing book and author data
  console.log('🗑️  Clearing existing books and authors...');
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
  console.log('✅ Existing data cleared\n');

  // Fetch and store books from Google Books API
  console.log('📚 Fetching books from Google Books API...\n');
  
  const allBooks = [];
  const existingISBNs = new Set();
  
  for (const query of SEARCH_QUERIES) {
    console.log(`   Searching for: "${query}"...`);
    const items = await fetchBooksFromGoogle(query, 10);
    
    for (const item of items) {
      if (allBooks.length >= 100) break;
      
      const book = await processGoogleBook(item, existingISBNs);
      if (book) {
        allBooks.push(book);
        process.stdout.write(`\r   📖 Books created: ${allBooks.length}/100`);
      }
    }
    
    if (allBooks.length >= 100) break;
    
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n\n✅ Successfully created ${allBooks.length} books from Google Books API\n`);

  // Summary
  const authors = await prisma.author.findMany();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(60));
  console.log('\n📈 Summary:');
  console.log(`   ├─ 📚 Books: ${allBooks.length}`);
  console.log(`   └─ ✍️  Authors: ${authors.length}`);
  
  console.log('\n💡 Database is now populated with books and their authors.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
