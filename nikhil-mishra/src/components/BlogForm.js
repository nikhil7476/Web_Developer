import { useState } from "react";
import dynamic from "next/dynamic";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

// Load Jodit Editor only on client side
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function BlogForm() {
  const [formData, setFormData] = useState({
    author: "",
    title: "",
    slug: "",
    date: "",
    tag: "",
    quote: "",
    excerpt: "",
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit as FormData (for image upload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    setFieldErrors({});

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "tag") {
          const tags = formData.tag.split(",").map((t) => t.trim());
          form.append("tag", JSON.stringify(tags));
        } else {
          form.append(key, formData[key]);
        }
      });

      if (imageFile) {
        form.append("image", imageFile);
      }

      const res = await fetch("/api/blog/addBlog", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Blog added successfully!" });

        setFormData({
          author: "",
          title: "",
          slug: "",
          date: "",
          tag: "",
          quote: "",
          excerpt: "",
          content: "",
        });

        setImageFile(null);
        setFieldErrors({});
      } else {
        setMessage({
          type: "danger",
          text: data.message || "Failed to add blog",
        });
        setFieldErrors(data.errors || {});
      }
    } catch (error) {
      setMessage({
        type: "danger",
        text: "A network error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4} className="mb-2">
            <Form.Group controlId="author">
              <Form.Label>Author *</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                isInvalid={!!fieldErrors.author}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.author}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4} className="mb-2">
            <Form.Group controlId="title">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                isInvalid={!!fieldErrors.title}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.title}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4} className="mb-2">
            <Form.Group controlId="slug">
              <Form.Label>Slug *</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                isInvalid={!!fieldErrors.slug}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.slug}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-2">
            <Form.Group controlId="date">
              <Form.Label>Date *</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                isInvalid={!!fieldErrors.date}
              />
            </Form.Group>
          </Col>

          <Col md={4} className="mb-2">
            <Form.Group controlId="tag">
              <Form.Label>Tags (comma separated) *</Form.Label>
              <Form.Control
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                isInvalid={!!fieldErrors.tag}
              />
            </Form.Group>
          </Col>

          <Col md={4} className="mb-2">
            <Form.Group controlId="quote">
              <Form.Label>Quote</Form.Label>
              <Form.Control
                type="text"
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                isInvalid={!!fieldErrors.quote}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12} className="mb-2">
            <Form.Group controlId="excerpt">
              <Form.Label>Excerpt *</Form.Label>
              <Form.Control
                type="text"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                isInvalid={!!fieldErrors.excerpt}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* IMAGE UPLOAD */}
        <Row>
          <Col md={12} className="mb-2">
            <Form.Group controlId="image">
              <Form.Label>Upload Blog Image *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                isInvalid={!!fieldErrors.image}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* TEXT EDITOR */}
        <Row>
          <Col md={12} className="mb-2">
            <Form.Group controlId="content">
              <Form.Label>Content *</Form.Label>

              <JoditEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
              />

              {fieldErrors.content && (
                <div className="text-danger">{fieldErrors.content}</div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant="success"
          type="submit"
          disabled={loading}
          className="mt-3"
        >
          {loading ? "Adding..." : "Add Blog"}
        </Button>
      </Form>
    </Container>
  );
}
