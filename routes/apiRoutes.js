const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")
const util = require("util")
const readFile = util.promisify(fs.readFile)
const getNotes = () => {
	return readFile("db/db.json", "utf-8").then(rawNotes => [].concat(JSON.parse(rawNotes)))
}

// GET Route for retrieving all the notes
// http://localhost:3001/api/notes/
router.get('/notes', (req, res) => {
	getNotes().then(notes => res.json(notes))
});

// GET Route for a specific notes

/* notes.get('/:notes_id', (req, res) => {
	const notesId = req.params.notes_id;
	readFromFile('./db/notes.json')
		.then((data) => JSON.parse(data))
		.then((json) => {
			const result = json.filter((notes) => notes.notes_id === notesId);
			return result.length > 0
				? res.json(result)
				: res.json('No note with that ID');
		});
}); */


// DELETE Route for a specific notes
router.delete('/notes/:id', (req, res) => {
	getNotes()
		.then((json) => {
			// Make a new array of all notess except the one with the ID provided in the URL
			const result = json.filter((notes) => notes.id !== req.params.id);

			fs.writeFile("db/db.json", JSON.stringify(result), (err) => {
				if (err) throw err;
				res.json({
					msg: "ok"
				})
			})
		});
});

// POST Route for a new UX/UI notes
// http://localhost:3001/api/notes/
router.post('/notes', (req, res) => {


	const { title, text } = req.body;

	if (req.body) {
		const newNotes = {
			title, text,
			id: uuidv4(),
		};

		/* const parseData =readAndAppend(newnotes, './db/db.json'); */
		getNotes().then(oldNotes => [...oldNotes, newNotes]).then(parseData => {
			fs.writeFile("db/db.json", JSON.stringify(parseData), (err) => {
				if (err) throw err;
				res.json({
					msg: "ok"
				})
			})

		})
	} else {
		res.error('Error in adding notes');
	}
});

module.exports = router;
