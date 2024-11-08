if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}


const express = require("express");
// const indexRouter = require('./route/index.js');
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./util/wrapasync");
const expressError = require("./util/expressErorr");
// const { listingSchema, reviewSchema } = require("./schema");
// const Review = require("./models/review");
const port = 3000;
const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';
// const review = require("./models/review");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const listings = require("./route/listing.js");
const reviews = require("./route/review.js")
const userRouter = require("./route/user.js")

const multer = require("multer");
const upload = multer({ dest: 'uploads/'})



// app.get("/", (req, res) => {
//     res.send("Request received");
// });

// app.use('/', indexRouter);

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};
app.use(flash());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




// //category
// app.get('/get-related-items', (req, res) => {
//     const category = req.query.category;
//     const items = data[category] || [];
//     res.json(items);
// });



app.get("/register", (req,res)=>{
    let {name ="anonymous"} = req.query;
    req.session.name =name;

    if(name==="anonymous"){
        req.flash("error","User Not Registered!")

    }
    else{

        req.flash("success","User Register Successfully!")
    }
    res.redirect("/hello")
});
app.get("/hello", (req,res)=>{
    res.render("listings/page",{name: req.session.name })
});

// //category
// app.get("/listings", (req, res) => {
//     const country = req.query.country;
  
//     if (country) {
//       const filteredListings = listings.filter(
//         (listing) => listing.country === country
//       );
//       res.json(filteredListings);
//     } else {
//       res.json(listings); // Return all listings if no country is specified
//     }
//   });

async function main() {
    try {
        await mongoose.connect(mongourl);
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
    }
}

main();

app.set("view engine", "ejs"); // Fixed typo
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));




// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const errmsg = error.details.map((el) => el.message).join(",");
//         throw new expressError(400, errmsg);
//     } else {
//         next();
//     }
// };
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const errmsg = error.details.map((el) => el.message).join(",");
//         throw new expressError(400, errmsg);
//     } else {
//         next();
//     }
// };



app.use("/listings",listings)
app.use("/listings/:id/reviews", reviews)
app.use("/",userRouter)

// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index", { allListings });
// }));

// app.get("/listings/new", (req, res) => {
//     res.render("listings/new");
// });

// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show", { listing });
// }));

// app.post("/listings", validateListing, wrapAsync(async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
    
//     if (!listing) {
//         return res.status(404).send("Listing not found");
//     }

//     res.render("listings/edit", { listing });
// }));


// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));
// //delete route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const deletedListing = await Listing.findByIdAndDelete(id);
//         if (!deletedListing) {
//             return res.status(404).send("Listing not found");
//         }
//         res.redirect("/listings");
//     } catch (err) {
//         console.error("Error deleting listing:", err);
//         res.status(500).send("Error deleting listing");
//     }
// }));


// //review
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
//   let listing= await Listing.findById(req.params.id);
//   let newReview =new Review(req.body.review);
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();
//   res.redirect(`/listings/${listing._id}`)

// }));

// //delete review route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
//     let { id, reviewId} = req.params;
//     Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }))


app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error", { message });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});


