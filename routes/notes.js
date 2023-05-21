const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
// http://localhost:3001/api/notes/
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific notes

notes.get('/:notes_id', (req, res) => {
  const notesId = req.params.notes_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((notes) => notes.notes_id === notesId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});


// DELETE Route for a specific notes
notes.delete('/:notes_id', (req, res) => {
  const notesId = req.params.notes_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notess except the one with the ID provided in the URL
      const result = json.filter((notes) => notes.notes_id !== notesId);

      // Save that array to the filesystem
      writeToFile('./db/notes.json', result);

      // Respond to the DELETE request
      res.json(`Item ${notesId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI notes
// http://localhost:3001/api/notes/
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newnotes = {
      title, text,
      id: uuidv4(),
    };

    const parseData =readAndAppend(newnotes, './db/db.json');
    res.json(parseData);
  } else {
    res.error('Error in adding notes');
  }
});

module.exports = notes;
