const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapasync");
const { listingSchema } = require("../schema");
const expressError = require("../util/expressErorr");
const Listing = require("../models/listing");
const{isLoggedIn} = require("../middleware")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
const mongoose = require("mongoose")





const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errmsg);
    } else {
        next();
    }
};



router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));



//new route
router.get("/new",isLoggedIn, (req, res) => {
   
    res.render("listings/new");
});

//show route

router.get("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Does Not Exists!")
        res.redirect("/listings")
    }
    
    res.render("listings/show", { listing });
}));
//create route
router.post("/",isLoggedIn, 
     upload.single("listing[image]"),
        validateListing,
    wrapAsync(async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}));
//edit route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Does Not Exists!")
        res.redirect("/listings")
    }
    
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    
    res.render("listings/edit", { listing });
}));


router.put("/:id", isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            return res.status(404).send("Listing not found");
        }
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Error deleting listing");
    }
}));




module.exports = router;