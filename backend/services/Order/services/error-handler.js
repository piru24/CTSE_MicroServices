const notFound = (req, res, next) => {
  return res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  console.error("Order service error:", err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed" });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier" });
  }

  return res.status(err.statusCode || 500).json({
    message: err.statusCode ? err.message : "Internal server error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
