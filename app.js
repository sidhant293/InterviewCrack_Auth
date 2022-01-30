const express=require('express');
const cors = require('cors');
const app=express();
const validation=require('./validation');

const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/validate',validation);

app.get('/',(req,res)=>{
    res.send(`InterviewCrack AuthServer Running On PORT: ${port}`);
})

app.listen(port,()=>console.log(`Listening to port ${port}`));
