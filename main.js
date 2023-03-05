var express = require('express');
const async = require('hbs/lib/async')
const mongo = require('mongodb');
const { ObjectId } = require('mongodb')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://khanhnguheo1707:01686316521@cluster0.kt6k2sr.mongodb.net/test'

const PORT = process.env.PORT || 1707
app.listen(PORT)
console.log("Server is running")

// Index page
app.get('/', (req,res) =>{
    res.render('AllToys')
})

// Add toy
app.get('/create',(req,res)=>{
    res.render('NewToy')
})

app.post('/NewToy',async (req,res)=>{
    let toyname = req.body.txtName
    let toyprice =req.body.txtPrice
    let toytype = req.body.txtType
    let toyreview = req.body.txtReview
    let toypublicationyear = req.body.txtPublicationyear
    let toy = {
        'toyname':toyname,
        'toyprice': toyprice,
        'toytype':toytype,
        'toyreview': toyreview,
        'toypublicationyear': toypublicationyear
    }
    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");
    await dbo.collection("Toy").insertOne(toy);
    if (toy == null) {
        res.render('/')
    }
    res.redirect('/ViewAll')
    
})

// All toy list
app.get('/ViewAll',async (req,res)=>{
    var page = req.query.page
    let client= await MongoClient.connect(url);
    let dbo = client.db("Toys");
        let toys = await dbo.collection("Toy").find().toArray()
        res.render('AllToys',{'toys':toys})
    
})

// Update ptoy
app.get('/update',async(req,res)=>{
    let id = req.query.id;
    const client = await MongoClient.connect(url)
    let dbo = client.db("Toys")
    let toys = await dbo.collection("Toy").findOne({_id : ObjectId(id)})
    res.render('update', {'toys': toys})

})
app.post('/updateToy', async(req,res)=>{
    let id = req.body._id;
    let toyname = req.body.txtName
    let toyprice =req.body.txtPrice
    let toytype = req.body.txtType
    let toyreview = req.body.txtReview
    let toypublicationyear = req.body.txtPublicationyear
    let client = await MongoClient.connect(url)
    let dbo = client.db("Toys")
    console.log(id)
    await dbo.collection("Toy").updateOne({_id: ObjectId(id)}, {
         $set: {
            'toyname':toyname,
            'toyprice': toyprice,
            'toytype':toytype,
            'toyreview': toyreview,
            'toypublicationyear': toypublicationyear
         }
    })
    res.redirect('/ViewAll')
})

// Delete toy
app.get('/delete',async(req,res)=>{
    let id = mongo.ObjectId(req.query.id); 
    const client = await MongoClient.connect(url);
    let dbo = client.db("Toys");
    let collection = dbo.collection('Toy')  
    let toys = await collection.deleteOne({'_id' : id});
    res.redirect('/ViewAll')
})



