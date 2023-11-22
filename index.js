const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination:'./uploads',
    filename:(req,file,cd)=>{
        return cd(null,`File-${Date.now()}-${file.encoding}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})
const key = 'content';
const port = 3000;
let arr = [{ id: 1, name: 'Arbaz', 'Session': 'C1MA-GTP', email: 'abc@xyz.com',profile_url:`http://localhost:${port}/data/File-1700642324809-7bit.jpg` },{ id: 2, name: 'Zahid', 'Session': 'C1MA-GTP', email: 'def@xyz.com',profile_url:`http://localhost:${port}/data/File-1700642324809-7bit.jpg` }];
app.use(express.json());
// multer
app.use('/data', express.static('uploads')); 
app.post('/upload',upload.single(key),(req,res)=>{
    console.log(req.file)    
    res.send(`see your uploaded file here : <a href="http://localhost:${port}/data/${req.file.filename}">http://localhost:${port}/data/${req.file.filename}<a/> <br> file info: ${req.file }`)

})
// token
app.post('/login',(req,res)=>{
  const token = jwt.sign({arr},key)
      res.send({token});
})

app.post('/result',(req,res)=>{
  jwt.verify(req.body.token,key,(err,result)=>{
      if(err){
          res.send("user not found")
      }else{
          res.send(result);
      }
  }) 
})
// crud
app.post('/create', (req, res) => {
    const a = req.body;
    const alredy_f = arr.find(frnd => frnd.id === a.id || frnd.name === a.name);
    if (alredy_f) {
      res.json({ message: `you enter same friend name: ${req.body.name} or id:${req.body.id} visit: http://localhost:${port}/update to update`, arr });
      return;
    }
    arr.push(a);
    res.send(arr);
  });

app.get('/read', (req, res) => {
  res.send(arr);
});

app.put('/update:id',(req,res)=>{
      const id = parseInt(req.params.id);
      const r = req.body;
      const f_index = arr.findIndex(fr=>fr.id===id);
      arr.splice(f_index,1);
      arr.push(r)
      res.send(arr);
});
app.delete('/delete:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const f_index = arr.findIndex(fr=>fr.id===id);
    arr.splice(f_index,1);
    res.send(arr);
})
app.listen(port, () => {
  console.log(`listening port ${port}`);
});
