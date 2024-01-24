const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req, res)=>{
    res.send("Hi, I am root");
});

//Index route
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
  });
 
  //new route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs")
});

//show route
app.get("/listings/:id", async (req, res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//create route
app.post("/listings", async(req, res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        console.log("ID:", id);

        const listing = await Listing.findById(id);
        console.log("Listing:", listing);

        if (!listing) {
            console.log("Listing not found");
            res.status(404).send("Listing not found");
            return;
        }

        res.render("listings/edit.ejs", { listing });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


//update route
app.put("/listings/:id", async(req, res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});
// app.get("/testListing", async (req, res)=>{
//     let samplelisting = new Listing({
//         title: "my home",
//         description: "by the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await samplelisting.save();
//     console.log("sample is saved");
//     res.send("sucessful testing");
// });

app.listen(8080, ()=>{
    console.log("server is ready on port 8080");
});

