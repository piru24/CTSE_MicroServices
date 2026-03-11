const Products = require("../model/products");
const axios= require("axios")

//get all products
const getAllProducts = async (req, res, next) => {
  let product;
  try {
    product = await Products.find();
  } catch (err) {
    console.log(err);
  }
  if (!product) {
    return res.status(404).json({ message: "Nothing found" });
  }
  return res.status(200).json(product);
};


//get products by id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let product;
  try {
    product = await Products.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!product) {
    return res.status(404).json({ message: "No product found" });
  }
  return res.status(200).json({product});
};

const getSearch = async (req, res, next) => {
  const { search } = req.query;
  let products = [];
  if (search) {
    products = await Products.aggregate([
      {
        $search: {
          index: 'products',
          compound: {
            should: [
              { autocomplete: { query: search, path: 'name', fuzzy: { maxEdits: 1 } } },
              { autocomplete: { query: search, path: 'brand', fuzzy: { maxEdits: 1 } } },
              { autocomplete: { query: search, path: 'sellerId', fuzzy: { maxEdits: 1 } } }
            ],
            minimumShouldMatch: 1
          }
        }
      },
      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          image: 1,
          weight: 1,
          sellerId: 1
        }
      }
    ]);
  } else {
    return res.status(400).json({ message: "Check the input" });
  }

  if (products.length === 0) {
    return res.status(200).json({ message: 'nothing to show', data: { products } });
  } else {
    return res.status(200).json({ message: 'Fetched products', data: { products } });
  }
};

//get products by sellerId
const getBySellerId = async (req, res, next) => {
  const id = req.userId;//this is the user's ID. which is get from the jwt token
  let products;
  try {
    products = await Products.find({sellerId:id});
  } catch (err) {
    console.log(err);
  }
  if (!products) {
    return res.status(404).json({ message: "No product found" });
  }
  return res.status(200).json(products);
};

//add products
const addProduct = async (req, res, next) => {
  //const sellerName = getSellerName();
    const { name, brand, price, weight, upload_date, description, image } =
      req.body;
    let product;
    try {
      product = new Products({
        sellerId:req.userId,//this id, we get it from token
        sellerName:req.userName,
        name, 
        brand, 
        price,
        weight,
        upload_date,
        description,
        image
      });
      await product.save();
    } catch (err) {
      console.log(err);
    }
    if (!product) {
      return res.status(500).json({ message: "Unable to add" });
    }
    return res.status(201).json(product);
  };

  //update products
const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const { name, brand, price, weight, upload_date, description, image } = req.body;
  let product;
  try {
    product = await Products.findByIdAndUpdate(id, {
      name, 
      brand, 
      price,
      weight,
      upload_date,
      description,
      image
    });
    product = await product.save();
  } catch (err) {
    console.log(err);
  }
  if (!product) {
    return res.status(404).json({ message: "Unable to Update by id" });
  }
  return res.status(200).json({ product });
};

//delete products
const deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  let product;
  try {
    product = await Products.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
  if (!product) {
    return res.status(404).json({ message: "Unable to Delete by id" });
  }
  return res.status(200).json({ message: "Product Successfully Deleted" });
};


  exports.addProduct = addProduct;
  exports.getAllProducts = getAllProducts;
  exports.getById = getById;
  exports.updateProduct = updateProduct;
  exports.deleteProduct = deleteProduct;
  exports.getSearch = getSearch;
  exports.getBySellerId = getBySellerId


  