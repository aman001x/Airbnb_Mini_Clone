const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../util/wrapasync.js");
const expressError = require("../util/expressErorr.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errmsg);
    } else {
        next();
    }
};



router.post("/", validateReview, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added!");
    res.redirect(`/listings/${listing._id}`)
  
  }));
  
  //delete review route
  router.delete("/:reviewId", wrapAsync(async(req,res)=>{
      let { id, reviewId} = req.params;
      Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted!");
      res.redirect(`/listings/${id}`);
  }))

  module.exports = router;