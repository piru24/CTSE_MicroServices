const { ORDER_STATUSES } = require("../utils/orderStatus");

const validStatuses = Object.values(ORDER_STATUSES);

const validateCreateOrder = (req, res, next) => {
  const { products, amount, status } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "products must be a non-empty array" });
  }

  for (const product of products) {
    if (!product.productId || !product.name) {
      return res.status(400).json({ message: "Each product requires productId and name" });
    }

    if (!Number.isInteger(product.quantity) || product.quantity < 1) {
      return res.status(400).json({ message: "Each product quantity must be an integer greater than 0" });
    }
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "amount must be a positive number" });
  }

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${validStatuses.join(", ")}` });
  }

  next();
};

const validateUpdateOrderStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${validStatuses.join(", ")}` });
  }

  next();
};

const validateStripePayment = (req, res, next) => {
  const { tokenId, amount } = req.body;

  if (!tokenId) {
    return res.status(400).json({ message: "tokenId is required" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "amount must be a positive number" });
  }

  next();
};

module.exports = {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateStripePayment
};
