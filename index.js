const express = require("express");
const fs = require('fs');
const multer = require("multer");
const upload = multer();
const app = express();
app.use(express.json());

let notes = [];
try{
    notes = JSON.parse(fs.readFileSync('notes.json'));
}catch (err){
    console.log('No notes file found, creating new one');
    fs.writeFileSync('notes.json',JSON.stringify(notes));
}

//оголошення рядка масивів
app.get('/notes',(req,res)=>{
    res.json(notes);
});

//Відправлення HTML-форми для завантаження нотаток:
app.get('/UploadForm.html', (req, res) => {
    res.sendFile(__dirname + '/static/UploadForm.html');
  });
  
// Завантаження нової нотатки 
app.post('/upload', upload.none(), (req, res) => {
    const { note_name, note } = req.body;
    const existingNote = notes.find(n => n.name === note_name);
  
    if (existingNote) {
      res.status(400).send('Note with this name already exists');
    } else {
      notes.push({ name: note_name, text: note });
      fs.writeFileSync('notes.json', JSON.stringify(notes));
      res.status(201).send('Note uploaded successfully');
    }
  });

// Отримання тексту конкретної нотатки: 
app.get('/notes/:name', (req, res) => {
const note = notes.find(n => n.name === req.params.name);
  
    if (note) {
      res.send(note.text);
    } else {
      res.status(404).send('Note not found');
    }
  });

  //Оновлення тексту нотатки:
app.put('/notes/:name', upload.none(), (req, res) => {
    const note = notes.find(n => n.name === req.params.name);
  
    if (note) {
      note.text = req.body.note;
      fs.writeFileSync('notes.json', JSON.stringify(notes));
      res.send('Note updated successfully');
    } else {
      res.status(404).send('Note not found');
    }
  });
  
  //Видалення нотатки:
app.delete('/notes/:name', (req, res) => {
    const noteIndex = notes.findIndex(n => n.name === req.params.name);
  
    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
      fs.writeFileSync('notes.json', JSON.stringify(notes));
      res.send('Note deleted successfully');
    } else {
      res.status(404).send('Note not found');
    }
  });
  
app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });


