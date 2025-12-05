import { useState } from "react";
import dynamic from "next/dynamic";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

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
  const [fieldErrors, setFieldErrors] = useState({});

  /** --------------------------------------
   * SEQUENTIAL VALIDATION — ONE TOAST ONLY
   --------------------------------------- */
  const validateSequential = () => {
    let errors = {};

    if (!formData.author.trim()) {
      toast.error("Author is required");
      errors.author = "Author is required";
      return errors;
    }
    if (!formData.title.trim()) {
      toast.error("Title is required");
      errors.title = "Title is required";
      return errors;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      errors.slug = "Slug is required";
      return errors;
    }
    if (!formData.date.trim()) {
      toast.error("Date is required");
      errors.date = "Date is required";
      return errors;
    }
    if (!formData.tag.trim()) {
      toast.error("Tags are required");
      errors.tag = "At least one tag is required";
      return errors;
    }
    if (!formData.excerpt.trim()) {
      toast.error("Excerpt is required");
      errors.excerpt = "Excerpt is required";
      return errors;
    }
    if (!formData.content.trim()) {
      toast.error("Content cannot be empty");
      errors.content = "Content cannot be empty";
      return errors;
    }
    if (!imageFile) {
      toast.error("Blog image is required");
      errors.image = "Blog image is required";
      return errors;
    }

    return {}; // No errors
  };

  // Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Image upload
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit form as multipart/form-data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // ✨ Sequential validation — stops at first missing field
    const errors = validateSequential();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

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

      if (imageFile) form.append("image", imageFile);

      const res = await fetch("/api/blog/addBlog", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add blog");

        if (data.errors) {
          setFieldErrors(data.errors);
        }
        return;
      }

      toast.success("Blog added successfully!");
      window.dispatchEvent(new Event("blogAdded"));

      // Reset form
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
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
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
