const express=require('express');
const app=express();
const validation=require('./validation');

app.use(express.json());

app.use('/validate',validation);

app.get('/',(req,res)=>{
    res.send(`InterviewCrack AuthServer Running`);
})

const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Listening to port ${port}`));
