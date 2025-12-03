import supabase from "../supabase/supabase.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "No authorization header provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
