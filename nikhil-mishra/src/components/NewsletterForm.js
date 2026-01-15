import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";

/* =====================
   Newsletter Form
====================== */
const NewsletterForm = () => {
  /* =====================
     State
  ====================== */
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================
     Validation Helper
  ====================== */
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  /* =====================
     Submit Handler
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email address!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.message || "Subscription failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     Render
  ====================== */
  return (
    <>
      <Form onSubmit={handleSubmit} className="newsletterForm">
        <Form.Group controlId="emailField">
          <Form.Control
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Button type="submit" disabled={loading} className="ctaBtn">
          {loading ? "Subscribing..." : <IoSend />}
        </Button>
      </Form>
    </>
  );
};

export default NewsletterForm;
