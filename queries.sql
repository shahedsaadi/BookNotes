-- Table for storing books
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT,
    author TEXT,
    cover_id INTEGER
);

-- Table for storing book reviews
CREATE TABLE book_reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    review_text TEXT,
    rating INTEGER,
    review_date DATE 
);