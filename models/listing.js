const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        set: (v)=> v===""? "https://unsplash.com/photos/an-old-brick-building-with-a-clock-on-the-front-of-it-413lqGnMqy0":v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;