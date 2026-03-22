const mongoose = require("mongoose");
const { ORDER_STATUSES } = require("../model/order");

const sendValidationError = (res, message) => {
  return res.status(400).json({ message });
};

const validateMongoId = (paramName) => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return sendValidationError(res, "Invalid id");
    }

    return next();
  };
};

const validateCreateOrder = (req, res, next) => {
  const { products, amount, status } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return sendValidationError(res, "products must be a non-empty array");
  }

  const invalidItem = products.find((item) => {
    return !item || !item.productId || !item.name || Number(item.quantity || 1) < 1;
  });

  if (invalidItem) {
    return sendValidationError(res, "Each product requires productId, name and quantity >= 1");
  }

  if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
    return sendValidationError(res, "amount must be a non-negative number");
  }

  if (status && !ORDER_STATUSES.includes(status)) {
    return sendValidationError(res, "invalid status");
  }

  return next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status || !ORDER_STATUSES.includes(status)) {
    return sendValidationError(res, "invalid status");
  }

  return next();
};

const validatePayment = (req, res, next) => {
  const { tokenId, amount } = req.body;

  if (!tokenId) {
    return sendValidationError(res, "tokenId is required");
  }

  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return sendValidationError(res, "amount must be a positive number");
  }

  return next();
};

module.exports = {
  validateMongoId,
  validateCreateOrder,
  validateUpdateStatus,
  validatePayment,
};
