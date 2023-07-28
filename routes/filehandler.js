const express = require('express');
const router = express.Router();
const fs =  require('fs');
const path = require('path');
const handleOrder = require('../services/handleOrder')
const fileUpload = require('express-fileupload');
const axios = require('axios')
const FormData = require('form-data');

function deleteFolderContents(folderPath) {
  // Read the contents of the folder
  const files = fs.readdirSync(folderPath);

  // Iterate over each file in the folder
  files.forEach(file => {
    const filePath = path.join(folderPath, file);

    // Delete the file
    fs.unlinkSync(filePath);
  });
}


router.use(fileUpload());

router.get('/', (req, res) => {
    res.send(`<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" />
    <button type="submit">Upload</button>
  </form>`);
});

router.post('/upload',(req, res) => {
  let lastNumber = req.body.lastNumber;
let id_cps = req.body.id_cps;
  // Check if a file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No file was uploaded.');
    return;
  }

  // Access the uploaded file
  const file = req.files.file;
  const filePath = 'uploads/' + file.name;

  // Move the file to the desired location
  file.mv(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading the file.'); 
      return;
    }
       // Check the file extension
      const fileExtension = path.extname(filePath);
      if (fileExtension.toLowerCase() !== '.docx') {
          res.status(400).send('Invalid file type. Only .docx files are allowed.');
          return;
      }
      
    console.log(filePath);
    handleOrder(filePath, Number(lastNumber))

    // Read the modified Word file
    const processedFilePath = './processed/' + `doc-${lastNumber}.docx`;
    fs.readFile(processedFilePath, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading the Word file.');
        return;
      }
       // Set the appropriate headers for the response
       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
       res.setHeader('Content-Disposition', 'attachment; filename="word-file.docx"');
       const sendToSpring= async()=>{

       // Send the modified Word file data as the response
      const formData = new FormData()
      formData.append("WordFile", data);
      formData.append("id_cps", id_cps);
      await axios.post("http://142.132.189.215:8181/api/Cps/uploadWordCps", formData).then(rs => {
        console.log("done")
        res.status(200).send(data);
      }).catch(err =>{
        console.log(err)
        res.status(301).json({ message : "there is an error, A big one hhh "+ err})
      })
       }
        // send back to angular
        res.status(200).send(data)
    });
    //deleteFolderContents('uploads') 
   // deleteFolderContents('processed')
  })
});

router.post('/file', (req, res)=>{
  console.log(req.body.file)
})

module.exports = router;
