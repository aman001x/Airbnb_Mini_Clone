const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{
        filename: {
            type: String,
            default: "default-image.jpg" // Placeholder filename
        },
        url: {
            type: String,
            default: "https://images.pexels.com/photos/19897324/pexels-photo-19897324/free-photo-of-aerial-view-of-rural-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" // Placeholder URL
        }
    },
    
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

   

   
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
