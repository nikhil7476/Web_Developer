/* =====================
   Admin Authentication Handler
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
     Request Payload
  ====================== */
  const { username, password } = req.body;

  /* =====================
     Environment Credentials
  ====================== */
  const ADMIN_USERNAME = process.env.Admin_Username;
  const ADMIN_PASSWORD = process.env.Admin_Password;

  /* =====================
     Authentication Logic
  ====================== */
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  }

  /* =====================
     Unauthorized Response
  ====================== */
  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
}
