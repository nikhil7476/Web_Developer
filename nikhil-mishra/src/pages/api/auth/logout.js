export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  res.setHeader(
    "Set-Cookie",
    "token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict"
  );

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
