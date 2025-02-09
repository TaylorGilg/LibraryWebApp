var express = require('express');
var app = express();
app.use(express.json());

//const cs = "mongodb+srv://<username>:<password>@development.ns5m6.mongodb.net/"
const {MongoClient} = require('mongodb');
const mongo = new MongoClient(cs);
let mydb;
let mycoll; 

async function initializeDB(){
  try{
    //finding number of documents currently in database
    const count = await mycoll.countDocuments(); 
    if(count == 0){ //if database is empty, initialize with beginning books
      let Books = [];
      //initializing library (array of book objects)
      Books = [{
        id: "1", 
        title: "Gentle Ben", 
        author: "Walt Morey", 
        publisher: "Turtleback Books", 
        isbn: "978-3-16-148410-0", 
        avail: true
      },
        {id: "2", 
        title: "Gotrek & Felix: The First Omnibus",
        author: "William King", 
        publisher:"Games Workshop", 
        isbn: "978-3-16-148410-2", 
        avail: true
      },
        {id: "3", 
        title: "Dune", 
        author:"Frank Herbert", 
        publisher:"Chilton Books", 
        isbn: "978-3-16-143310-1", 
        avail: true
      },
        {id: "4",
        title: "Lord of The Rings", 
        author: "J. R. R. Tolkien", 
        publisher: "Houghton Mifflin Harcourt", 
        isbn: "987-6-54-148220-1", 
        avail: false, 
        who: "Homer", 
        due: "1/1/24"
      },
        {id: "5",
        title: "Rogue Squadron", 
        author: "Michael A. Stackpull", 
        publisher: "LucasArts", 
        isbn: "987-6-54-321123-1", 
        avail: false, 
        who: "Marge", 
        due: "1/2/24"
      },
        {id: "6", 
        title: "The Scottish Nation at Empire's End", 
        author: "Brian Glass", 
        publisher: "Palgrave Macmillan", 
        isbn: "987-6-54-321123-2", 
        avail: false, 
        who: "Lisa", 
        due: "1/3/24"
      },
        {id: "7",
        title: "The Fault In Our Stars", 
        author: "John Green", 
        publisher: "Dutton Books", 
        isbn: "987-6-54-321123-1", 
        avail: false, 
        who: "Marge", 
        due: "1/23/24"
      },
        {id: "8",
        title: "The Iliad", 
        author: "Homer", 
        publisher: "Penguin Classics", 
        isbn: "987-6-54-451123-1", 
        avail: false, 
        who: "Jayce", 
        due: "1/12/24"
    },
        {id: "9",
        title: "The Odyssey", 
        author: "Homer", 
        publisher: "Penguin Classics", 
        isbn: "987-6-54-481123-2", 
        avail: false, 
        who: "Viktor", 
        due: "1/2/24"
    },
        {id: "10",
        title: "Game of Throwns", 
        author: "George R. R. Martin", 
        publisher: "HarperCollins", 
        isbn: "987-6-54-422123-0", 
        avail: false, 
        who: "Jinx", 
        due: "1/5/24"
    }
    ];

      //insert multiple documents into the database in collection
      await mycoll.insertMany(Books);
      console.log("Database successfully initialized.");
    }
    else{ //if database already has starting contents
      console.log("Database has already been initialized.");
    }
  }
  catch(e){
    console.error("Error initializing database: ", e);
  }
  }

//server starts only after MongoDB connection is established
mongo.connect().then(() => 
{
  mydb = mongo.db("LibraryDB"); //select database
  mycoll = mydb.collection("Lib"); //select collection

  //starting server after successful MongoDB connection & initialization
  initializeDB().then(() => {
    app.listen(3000, () => console.log('Server is running on port 3000.'));
  }).catch (e =>{
    console.error("Error connecting to MongoDB: ", e);
    process.exit(1); //exit if connection fails
  });
});
  
  app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization, Content-Length, X-Requested-With');
    //res.setHeader('Cache-Control', 'no-store');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
  });


  //returns first book found with specific id and 404 if no book is found at all
  app.get('/books/:id', async (req, res) => {
    try{
        //finds and returns first book with matching id
        const book = await mycoll.findOne({id: req.params.id});
        if (book){
          return res.status(200).json(book);
        } //if no book is returned 
          return res.status(404).json({message: 'No book found with that id.'});
    }
    catch(e){
      return res.status(500).json({message: 'Error fetching book.', error: e});
    }
  });

  //if avail specified in query, returns either all available or unavailable books
  //if no avail in query, returns all books
  app.get('/books', async (req, res) => {
    try{
      const {avail} = req.query; //fetch the avail query parameter
      //if avail query is defined, show either all available or unavailable books
      if (avail !== undefined){
        //making sure avail is only either true or false value
        if(avail !== 'true' && avail !== 'false'){
          return res.status(400).json({message: "avail must be 'true' or 'false'."});
        }
      
      //converting from string to boolean
      const isAvailable = avail === 'true';
      //returns array of the ids and titles of the books that have matching avail value
      //projection "turns on" display of id and title while "turning off" display of default database id
      //const books = await mycoll.find({avail: isAvailable}, {projection: {id: 1, title: 1, _id:0}}).toArray();
      const books = await mycoll.find({avail: isAvailable}).toArray();
      return res.status(200).json(books);
      }
      //if no specified avail query, return all books ids and titles
      //const allBooks = await mycoll.find({}, {projection: {id: 1, title: 1, _id: 0}}).toArray();
      const allBooks = await mycoll.find({}).toArray();
      return res.status(200).json(allBooks)
    }
    catch (e){
      return res.status(500).json({message: 'Error fetching books.', error: e});
    }
  });

  //creates a new book and adds it to the database
  app.post('/books', async (req, res) =>{
    //fetching property values from req body (translating JSON to object)
    const {id, title, author, publisher, isbn, avail, who, due} = req.body; 

    //checking for all mandatory property fields
    if(!id || !title || !author || !publisher || !isbn || !avail){
      return res.status(403).json({message: 'id, title, author, publisher, isbn, and avail are required.'});
    }

    //making sure avail is stored as boolean in object
    const isAvailable = avail === 'true' || avail === true; 

    try{
      const book = await mycoll.findOne({id});
      if(book){ 
        return res.status(403).json({message: 'A book with this id already exists.'});
      }
        //creating new book object based off of fetched values
        const newBook = {
        id,
        title, 
        author, 
        publisher, 
        isbn, 
        avail: isAvailable,
        who, 
        due
      };
        //add the new book obj to database
        const confirm = await mycoll.insertOne(newBook);
        if(confirm.acknowledged){
          return res.status(201).json(newBook);
        }
    }
    catch(e){
      return res.status(500).json({message: 'Error creating book.', error: e});
    }
    
  });

  //search book by id and update its details
  app.put('/books/:id', async (req, res) =>{
    try{
      //storing details to edit from request body
      const updateData = req.body; 

      //converting avail to boolean if present in details to edit
      if(updateData.avail !== undefined){
        updateData.avail = updateData.avail === 'true' || updateData.avail === true; 
      }

      //finds and returns first book with matching id
      const book = await mycoll.findOne({id: req.params.id});
      if (!book){
        return res.status(404).json({message: 'No book found with that id.'});
      }
        //filters with id and updates by merging original book with a new object of the submitted properties
        //'after' and using findOneAndUpdate returns the updated book object
        const updatedBook = await mycoll.findOneAndUpdate({id: req.params.id}, {$set: updateData}, {returnDocument: 'after'});
        return res.status(200).json(updatedBook);
    }
    catch(e){
      return res.status(500).json({message: 'Error updating book.', error: e});
    }

  });

  //search for book by id and delete it
  app.delete('/books/:id', async (req, res) =>{
    try{
      //finds book object by id and deletes it from database
      const book = await mycoll.findOneAndDelete({id: req.params.id});
      if(!book.value){
        return res.status(400).json({message: 'No book found with that id.'});
      }
      else{
        return res.status(200).json(book.value);
      }
      
    }
    catch (e){
      return res.status(500).json({message: "Error deleting book.", error: e})
    }

  });
  