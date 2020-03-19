var express = require("express");
var fs = require("fs");
var path = require("path");

// Sets up the Express App
var app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, "Develop/public")));

// Server listens

const PORT = process.env.port || 4000;

app.listen(PORT, () => console.log("Server started on port " + PORT));

// using GET method to retrive info

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/db/db.json"));
});

//Post Method
// creating the post to return the notes as JSON object

app.post("/api/notes", function(req, res) {
  fs.readFile(path.join(__dirname, "Develop/db/db.json"), function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
      throw err;
    }

    var notes = JSON.parse(result); // json server objects
    var getNote = req.body; // body of the note which includes text and body
    var noteID = notes.length + 1;
    var newNote = {
      id: noteID,
      text: getNote.text, // we can also say req.body.text
      title: getNote.title // we can also say req.body.title
    };
    notes.push(newNote);
    res.json(newNote);
    fs.writeFile(
      path.join(__dirname, "Develop/db/db.json"),
      JSON.stringify(notes),
      function(err) {
        if (err) throw err;
      }
    );
  });
});

// Delete Method
app.delete("/api/notes/:id", function(req, res) {
  fs.readFile(path.join(__dirname, "Develop/db/db.json"), function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
      throw err;
    }

    const deleteNote = req.params.id;
    var notes = JSON.parse(result);
    if (deleteNote <= notes.length) {
      res.json(notes.splice(deleteNote - 1, 1));

      for (let i = 0; i < notes.length; i++) {
        notes[i].id = i + 1;
      }
      fs.writeFile("Develop/db/db.json", JSON.stringify(notes), function(err) {
        if (err) throw err;
      });
    } else {
      res.json(false);
    }
  });
});
