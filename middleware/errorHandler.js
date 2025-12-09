//  404 Handler (Route Not Found)
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `The requested route '${req.method} ${req.originalUrl}' does not exist.`,
  });
}

//  Global Error Handler (For all other errors)
export function globalErrorHandler(err, req, res, next) {
  console.error(" SERVER ERROR:", err);

  const statusCode = err.statusCode || 500;
  const errorName = err.name || "ServerError";
  const message = err.message || "Something went wrong on the server.";

  res.status(statusCode).json({
    success: false,
    error: errorName,
    message,
    // stack should only be sent in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
