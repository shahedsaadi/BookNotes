# Overview:
The Book Notes website is inspired by the idea of taking notes on books to remember key points and serve as a reference for others. It is a great tool for those who want to write and edit reviews, as well as read reviews from other readers.
Books are easily sortable by rating, title, and author, making it simple to find exactly what you’re looking for.

# Technology Stack:
- HTML5.
- CSS.
- JavaScript.
- EJS.
- Node.js.
- Express.js.
- PostgreSQL.
- API.

# Visit The Website:
- Click on the link:  https://booknotes-u2vp.onrender.com/
 
# To Run The Project:
- Create your Database you can name it any name, then take the Schema Definition from queries.sql file.
- Clone the repository, inside the terminal (git clone https://github.com/shahedsaadi/BookNotes.git).
- Run npm install

*-* After finishing the previous steps you need to follow the next instructions to complete the steps of running the project locally:

- Delete this part of the code that is the DB connection inside index.js file:

```javascript
const { Pool } = pg;
let connString = process.env.DATABASE_URL;
const db = new Pool({
  connectionString: connString,
  ssl: {
    rejectUnauthorized: false,
  },
});
```

- Replace it with this inside index.js:
```javascript
const db = new pg.Client({
  user: 'your_database_user',
  host: 'your_database_host',
  database: 'your_database_name', // For example booknotes
  password: 'your_database_password',
  port: your_database_port,
});
```
  - Run node index.js
  - Visit the link http://localhost:3000/

# Website Screenshot:
- This is the home page, you can scroll down to see the rest of the book reviews, and sort the book reviews by choosing the way of sorting.
  
![b1](https://github.com/shahedsaadi/BookNotes/assets/108287237/58f03ed1-e5ce-4e47-a4c7-7431e9ccc0a0)

- To add a new book, simply tap into the search bar and enter the book name, author name, or ISBN. A list of books will appear, and you can choose the desired book by selecting it.

![b2](https://github.com/shahedsaadi/BookNotes/assets/108287237/c4b84cbb-5444-466b-988a-493aa1d28144)

- To add a review, write your review in the text area, give it a rating, and then press the "Add review" button.

![b3](https://github.com/shahedsaadi/BookNotes/assets/108287237/8d6589ee-5208-442c-b0fe-09f5e7b3574c)

- After adding the review, you have two options: Edit and Delete buttons. Use Edit to modify the book review and rating, and Delete to remove the entire book review.

![b4](https://github.com/shahedsaadi/BookNotes/assets/108287237/98d35149-b259-4d37-bcd3-30a4f9eda955)

- To update the review, write the changes in the text area and update the rating if needed. To save the updated review, press the "Update" button.

![b5](https://github.com/shahedsaadi/BookNotes/assets/108287237/8c891083-591f-45bf-b685-864a9f25f9b9)


