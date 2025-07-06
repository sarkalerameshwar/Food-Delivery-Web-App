import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Get token from Authorization header (standard practice)
  const authHeader = req.headers.authorization;

  console.log("Auth Middleware: Authorization header received:", authHeader);

  if (!authHeader) {
    console.log("Auth Middleware: Authorization header missing");
    return res.status(401).json({
      success: false,
      message: "Authentication required. Authorization header missing."
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log("Auth Middleware: Authorization header malformed:", authHeader);
    return res.status(401).json({
      success: false,
      message: "Authentication required. Authorization header malformed."
    });
  }

  const token = parts[1];
  console.log("Auth Middleware: Token from header:", token);

  if (!token) {
    console.log("Auth Middleware: No token provided");
    return res.status(401).json({ 
      success: false,
      message: "Authentication required. Please provide a valid token." 
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Additional checks (optional)
    if (!decoded.id) {
      throw new Error("Invalid token payload");
    }
    
    // 4. Attach user to request
    req.user = {
      id: decoded.id,
      // Add other relevant user data from token if needed
    };
    
    console.log("Auth Middleware: Token verified for user ID:", decoded.id);
    next();
  } catch (err) {
    console.error("Auth Middleware: Token verification failed:", err.message, "Error name:", err.name, "Stack:", err.stack);
    
    // Differentiate between different types of errors
    const message = err.name === 'TokenExpiredError' 
      ? "Session expired. Please log in again."
      : "Invalid authentication token.";
    
    return res.status(401).json({ 
      success: false,
      message,
      error: err.name // Optional: helps frontend handle specific cases
    });
  }
};

export default authMiddleware;