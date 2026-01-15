/* =====================
   Logout Handler
====================== */
export default function handler(req, res) {
  /* =====================
     Method Validation
  ====================== */
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  /* =====================
     Clear Authentication Cookie
  ====================== */
  res.setHeader(
    "Set-Cookie",
    "token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict"
  );

  /* =====================
     Success Response
  ====================== */
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
