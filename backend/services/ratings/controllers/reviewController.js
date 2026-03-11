const Reviews = require("../model/review");

//get all reviews
const getAllReviews = async (req, res, next) => {
  let review;
  try {
    review = await Reviews.find();
  } catch (err) {
    console.log(err);
  }
  if (!review) {
    return res.status(404).json({ message: "Nothing found" });
  }
  return res.status(200).json(review);
};

//get reviews by id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let review;
  try {
    review = await Reviews.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!review) {
    return res.status(404).json({ message: "No product found" });
  }
  return res.status(200).json(review);
};

//add reviews
const addReview = async (req, res, next) => {
    const { product_id,rate,reviews } =
      req.body;
    let review;
    try {
        review = new Reviews({
            product_id,
            rate,
            reviews
      });
      await review.save();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unable to add" });
    }
    console.log("success in adding review");
    return res.status(201).json({message: "Success", data: review});
  };

  //update reviews
const updateReview = async (req, res, next) => {
  const id = req.params.id;
  const { rate,reviews } = req.body;
  let review;
  try {
    review = await Reviews.findByIdAndUpdate(id, {
        rate,
        reviews
    });
    review = await review.save();
  } catch (err) {
    console.log(err);
  }
  if (!review) {
    return res.status(404).json({ message: "Unable to Update by id" });
  }
  return res.status(200).json({ review });
};

//delete reviews
const deleteReview = async (req, res, next) => {
  const id = req.params.id;
  let review;
  try {
    review = await Reviews.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
  if (!review) {
    return res.status(404).json({ message: "Unable to Delete by id" });
  }
  return res.status(200).json({ message: "Review Successfully Deleted" });
};


  exports.addReview = addReview;
  exports.getAllReviews = getAllReviews;
  exports.getById = getById;
  exports.updateReview = updateReview;
  exports.deleteReview = deleteReview;