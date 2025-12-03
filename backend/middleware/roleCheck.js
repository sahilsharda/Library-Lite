// Role-based access control middleware

export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const userRole = req.user.role || "member";

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: userRole,
      });
    }

    next();
  };
};

export const isAdmin = checkRole("admin");
export const isLibrarian = checkRole("admin", "librarian");
export const isMember = checkRole("admin", "librarian", "member");
