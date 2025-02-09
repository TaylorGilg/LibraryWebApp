# Full Stack Library Web App, Internet Software Development (Fall 2024)

This project is a Library Management System built using React for the frontend and Express with MongoDB for the backend. 
- Allows users to view a list of all books and click on them to see their respective details.
- Allows users to view a list of available books and check out (changes loanee name variable attribute for book in database) from this list (also displays due date based on user inputed book loan duration).
- Allows users to view a list of unavailable books and check in books (select from a list of book loanees user is checking in for).
- Available and unavailable book lists update accordingly to check-ins and check-outs. 

## Getting Started
### Prerequisites
- Node.js
- npm
- MongoDB

### Installation
1. Clone the repository:
git clone https://github.com/your-username/LibraryWebApp.git

2. Install Dependencies:
   1. cd LibraryWebApp
   2. npm install
      - Note: In order to run this web app, you must use your own MongoDB account and uncomment line 5 of index.js, filling in your own corresponding credentials.

### Running the Repo
1. I suggest downloading Compass for MongoDB management to easily start up the database and be able to see user changes to database values.
   - Note: The repo populates a database of books and respective attributes on startup if one by the name of LibraryDB does not already exist. 
3. node index.js (starts the backend, for development purposes the backend and frontend operate on different ports)
4. cd library-client
5. npm start (to start the front end)
6. Answer "Y" to prompt: 
√ Something is already running on port 3000.
Would you like to run the app on another port instead? (Y/n)
7. The site should now be running now on http://localhost:3001

Here's a demo of the site (User interactions and changes to values should be able to be seen in the database itself via Compass MongoDB)
https://github.com/user-attachments/assets/b09945d3-970a-4efd-aa43-fc33bbd36157

Testing and API endpoint debugging done with Postman

