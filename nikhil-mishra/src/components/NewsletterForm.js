import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Email Validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

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

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="emailField">
          <Form.Control
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Button
          variant="outline-dark"
          type="submit"
          disabled={loading}
          className="mt-2"
        >
          {loading ? "Subscribing..." : "SUBSCRIBE"}
        </Button>
      </Form>
    </>
  );
};

export default NewsletterForm;
