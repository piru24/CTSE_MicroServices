const PRODUCT_SERVICE_URL = (process.env.PRODUCT_SERVICE_URL || "http://localhost:8070/products").replace(/\/$/, "");

const normalizeProductResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Product validation failed");
    error.statusCode = response.status;
    throw error;
  }

  if (!data || !data.product) {
    const error = new Error("Invalid response from Product Service");
    error.statusCode = 502;
    throw error;
  }

  return data.product;
};

const fetchProductById = async (productId, authHeader, cookieHeader) => {
  const headers = {};

  if (authHeader) {
    headers.Authorization = authHeader;
  }

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  try {
    const response = await fetch(`${PRODUCT_SERVICE_URL}/getProduct/${productId}`, {
      method: "GET",
      headers,
    });

    return normalizeProductResponse(response);
  } catch (err) {
    const error = new Error("Product Service unavailable");
    error.statusCode = 503;
    throw error;
  }
};

const validateProductsAgainstCatalog = async (items, authHeader, cookieHeader) => {
  const validated = [];

  for (const item of items) {
    const product = await fetchProductById(item.productId, authHeader, cookieHeader);

    validated.push({
      productId: item.productId,
      name: product.name || item.name,
      quantity: item.quantity,
    });
  }

  return validated;
};

module.exports = {
  validateProductsAgainstCatalog,
  PRODUCT_SERVICE_URL,
};
