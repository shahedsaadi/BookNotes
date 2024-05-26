import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const { Pool } = pg;
let connString = process.env.DATABASE_URL;
const db = new Pool({
  connectionString: connString,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
.then(() => {
  console.log('Connected to the database');
})
.catch(err => {
  console.error('Database connection error:', err.stack);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let sort = "review_id";

app.get("/", async(req,res)=>{

    try{
      const result = await db.query(`
      SELECT * FROM books
      JOIN book_reviews ON books.id= book_id
      ORDER BY ${sort} DESC `
      )
      // Format review_date as YYYY-MM-DD
      const data = result.rows.map(book => {
        const reviewDate = new Date(book.review_date);
        const year = reviewDate.getFullYear();
        const month = String(reviewDate.getMonth() + 1).padStart(2, '0');
        const day = String(reviewDate.getDate()).padStart(2, '0');
        const formattedReviewDate = `${day}-${month}-${year}`;
        return { ...book, review_date: formattedReviewDate };
    });

    // Render index.ejs with formatted review_date
    res.render("index.ejs", { books: data });

    }catch(err){
      console.log(err);
    }
});

app.post("/sort", async(req,res)=>{
    sort = req.body.sort;
    res.redirect("/");
});

app.get("/book", async(req,res)=>{
    const bookTitle = req.query.title;
    const author = req.query.author;
    const coverId = req.query.coverId;

    try {
     const result = await db.query(`
      SELECT * FROM books
      JOIN book_reviews ON books.id= book_id
     `);
      const data = result.rows;
      //check if book title exists in database with review already.
      const bookCheck = data.find((book) => book.title == req.query.title);
      //Depending on whether bookCheck exists, the review and book_id variables are set accordingly.
      const review = bookCheck ? bookCheck.review_text : undefined;
      const bookId = bookCheck ? bookCheck.id : undefined;
      
      //review and bookId are dynamically populated based on the result of the database query.
      res.render("book_modify.ejs", {
        title: bookTitle,
        author: author,
        cover: coverId,
        review: review,
        bookId: bookId
      });
    }catch(err){
        console.log(err);
    }
});

app.post("/addBook", async(req,res)=>{
    const bookTitle = req.body.title;
    const author = req.body.author;
    const coverId = req.body.cover_id;
    const rating = req.body.rating;
    const review_text = req.body.review_text;
    const currentDate = new Date().toISOString().slice(0, 10); 

    try {
      // Begin a transaction
      await db.query('BEGIN');
      //The first query inserts a new book into the "books" table and returns the id of the newly inserted record.
      const newBook = await db.query(`
        INSERT INTO books (title, author, cover_id)
        VALUES ($1,$2,$3)
        RETURNING id`, [bookTitle, author, coverId]
      );
      //The second query inserts a new review into the "book_reviews" table, using the book id obtained from the first query, along with the review text and rating.
      const newReview = await db.query(`
        INSERT INTO book_reviews (book_id, review_text, rating, review_date)
        VALUES ($1,$2,$3,$4)
        RETURNING *`, [newBook.rows[0].id, review_text, rating, currentDate]
      );

      // Commit the transaction if both inserts are successful
      await db.query('COMMIT');
      res.redirect("/");
    } catch (err) {
       // Rollback the transaction if an error occurs
       await db.query('ROLLBACK');
       console.log(err);
    }
});

app.post("/updateReview", async(req,res)=>{
    const review_text = req.body.review_text;
    const rating = req.body.rating;
    const book_id = req.body.bookId;
    const currentDate = new Date().toISOString().slice(0, 10); //current date in the format YYYY-MM-DD.
    // console.log(currentDate);

    try {
      const result = await db.query(`
        UPDATE book_reviews
        SET review_text = $1, rating = $2, review_date = $3
        WHERE book_id = $4
        RETURNING *`, [review_text, rating, currentDate, book_id]
       )

       const data = result.rows;
       res.redirect("/");
    } catch(err){
        console.log(err);
    }
});

app.post("/delete", async(req,res)=>{
  const bookId = req.body.deleteItemId;

  try {
    await db.query('BEGIN');
    await db.query(`
      DELETE FROM book_reviews
      WHERE book_id = $1
      `, [bookId]); // The parameters should be passed as an array.
    await db.query(`
      DELETE FROM books
      WHERE id = $1
      `, [bookId]); 
  
    await db.query('COMMIT');
    res.redirect('/'); 
  } catch (err) {
    await db.query('ROLLBACK');
    console.log(err);
    res.status(500).send('Error deleting book');
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

