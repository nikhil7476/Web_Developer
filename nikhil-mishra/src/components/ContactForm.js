import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsSend } from "react-icons/bs";
import { toast } from "react-toastify";

/* =====================
   Contact Form Component
====================== */
export default function ContactForm() {
  /* =====================
     State
  ====================== */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message_content: "",
  });

  const [loading, setLoading] = useState(false);

  /* =====================
     Validation Helpers
  ====================== */
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/; // 10-digit phone number
    return regex.test(phone);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required!");
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Enter a valid email address!");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required!");
      return false;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number!");
      return false;
    }

    if (!formData.subject.trim()) {
      toast.error("Subject is required!");
      return false;
    }

    if (!formData.message_content.trim()) {
      toast.error("Message content is required!");
      return false;
    }

    return true;
  };

  /* =====================
     Submit Handler
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/contacts/addContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Contact details added successfully!");

        /* =====================
           Reset Form
        ====================== */
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message_content: "",
        });
      } else {
        toast.error(data.message || "Failed to submit contact form.");
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
    <Container>
      <Form onSubmit={handleSubmit}>
        {/* =====================
            Name & Email
        ====================== */}
        <Row>
          <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
            <Form.Group controlId="name">
              <Form.Label>
                Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </Form.Group>
          </Col>

          <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
            <Form.Group controlId="email">
              <Form.Label>
                Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* =====================
            Phone & Subject
        ====================== */}
        <Row>
          <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
            <Form.Group controlId="phone">
              <Form.Label>
                Phone <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="phone"
                placeholder="9027xxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </Form.Group>
          </Col>

          <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
            <Form.Group controlId="subject">
              <Form.Label>
                Subject <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="subject"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* =====================
            Message
        ====================== */}
        <Row>
          <Col xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
            <Form.Group controlId="message_content">
              <Form.Label>
                Message <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message_content"
                placeholder="Write your message here..."
                value={formData.message_content}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    message_content: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* =====================
            Submit Button
        ====================== */}
        <Button
          variant="secondary"
          type="submit"
          disabled={loading}
          className="ctaBtn"
        >
          {loading ? (
            "Submitting..."
          ) : (
            <>
              Send Message <BsSend />
            </>
          )}
        </Button>
      </Form>
    </Container>
  );
}
