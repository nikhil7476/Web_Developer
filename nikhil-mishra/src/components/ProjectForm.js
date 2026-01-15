import { useState } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ProjectForm() {
  /* =====================
     Initial State
  ====================== */
  const initialFormData = {
    title: "",
    slug: "",
    bannerDescription: "",

    tag: "",
    featureList: "",

    problem: "",
    problemStatement: "",
    solution: "",
    solutionOverview: "",

    technologiesUsed: "",

    projectLink: "",
    githubLink: "",

    learned: "",
    whatIlearned: "",

    faq: [{ question: "", answer: "" }],
  };

  const initialImages = {
    featuredImage: null,
    bannerImage: null,
    problemImage: null,
    solutionImage: null,
    galleryImages: [],
    technologiesUsedImages: [],
  };

  /* =====================
     State
  ====================== */
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState(initialImages);
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);

  /* =====================
     Validation (Sequential)
  ====================== */
  const validateSequential = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }
    if (!formData.bannerDescription.trim()) {
      toast.error("Banner description is required");
      return false;
    }
    return true;
  };

  /* =====================
     Handlers
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const fileArray = Array.from(files);

    setImages((prev) => ({
      ...prev,
      [name]: files.length > 1 ? fileArray : files[0],
    }));

    setPreviews((prev) => ({
      ...prev,
      [name]: fileArray.map((file) => URL.createObjectURL(file)),
    }));
  };

  const removeImage = (field, index = null) => {
    setImages((prev) => {
      if (Array.isArray(prev[field])) {
        const updated = [...prev[field]];
        updated.splice(index, 1);
        return { ...prev, [field]: updated };
      }
      return { ...prev, [field]: null };
    });

    setPreviews((prev) => {
      if (Array.isArray(prev[field])) {
        const updated = [...prev[field]];
        updated.splice(index, 1);
        return { ...prev, [field]: updated };
      }
      return { ...prev, [field]: [] };
    });
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...formData.faq];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, faq: updated }));
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  /* =====================
     Submit
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSequential()) return;

    setLoading(true);

    try {
      const form = new FormData();

      /* Core */
      form.append("title", formData.title);
      form.append("slug", formData.slug);
      form.append("bannerDescription", formData.bannerDescription);

      /* Arrays */
      ["tag", "featureList", "technologiesUsed"].forEach((key) => {
        form.append(
          key,
          JSON.stringify(
            formData[key]
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
          )
        );
      });

      /* Headings */
      ["problem", "solution", "learned"].forEach((key) =>
        form.append(key, formData[key])
      );

      /* Content */
      ["problemStatement", "solutionOverview", "whatIlearned"].forEach((key) =>
        form.append(key, formData[key])
      );

      /* Links */
      form.append("projectLink", formData.projectLink);
      form.append("githubLink", formData.githubLink);

      /* FAQ */
      form.append("faq", JSON.stringify(formData.faq));

      /* Images */
      Object.entries(images).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((file) => form.append(key, file));
        } else if (value) {
          form.append(key, value);
        }
      });

      const res = await fetch("/api/project/addProject", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to add project");
        return;
      }

      toast.success("Project added successfully!");
      window.dispatchEvent(new Event("projectAdded"));

      /* ✅ RESET */
      setFormData(initialFormData);
      setImages(initialImages);
      setPreviews({});
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     Image Preview
  ====================== */
  const ImagePreview = ({ name }) =>
    previews[name]?.length > 0 && (
      <Row className="mt-2">
        {previews[name].map((src, i) => (
          <Col xs={4} key={i} className="mb-2 position-relative">
            <Image src={src} thumbnail />
            <Button
              size="sm"
              variant="danger"
              style={{
                position: "absolute",
                top: "4px",
                right: "6px",
                padding: "0 6px",
              }}
              onClick={() => removeImage(name, i)}
            >
              ✕
            </Button>
          </Col>
        ))}
      </Row>
    );

  /* =====================
     Render
  ====================== */
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        {/* Core */}
        <Row>
          <Col md={4} className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Slug *</Form.Label>
            <Form.Control
              name="slug"
              value={formData.slug}
              onChange={handleChange}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Banner Description *</Form.Label>
            <Form.Control
              name="bannerDescription"
              value={formData.bannerDescription}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Tags */}
        <Row>
          <Col md={4} className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              name="tag"
              placeholder="UI, SaaS"
              value={formData.tag}
              onChange={handleChange}
            />
            <Form.Text muted>Comma separated</Form.Text>
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Features</Form.Label>
            <Form.Control
              name="featureList"
              placeholder="Auth, SEO"
              value={formData.featureList}
              onChange={handleChange}
            />
            <Form.Text muted>Comma separated</Form.Text>
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Technologies Used</Form.Label>
            <Form.Control
              name="technologiesUsed"
              placeholder="React, Next.js"
              value={formData.technologiesUsed}
              onChange={handleChange}
            />
            <Form.Text muted>Order matters</Form.Text>
          </Col>
        </Row>

        {/* Images */}
        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>Technology Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              name="technologiesUsedImages"
              onChange={handleImageChange}
            />
            <ImagePreview name="technologiesUsedImages" />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Gallery Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              name="galleryImages"
              onChange={handleImageChange}
            />
            <ImagePreview name="galleryImages" />
          </Col>
        </Row>

        <Row>
          {[
            ["featuredImage", "Featured Image"],
            ["bannerImage", "Banner Image"],
            ["problemImage", "Problem Image"],
            ["solutionImage", "Solution Image"],
          ].map(([key, label]) => (
            <Col md={3} key={key} className="mb-3">
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type="file"
                name={key}
                onChange={handleImageChange}
              />
              <ImagePreview name={key} />
            </Col>
          ))}
        </Row>

        {/* Content */}
        <Row>
          {[
            ["problem", "Problem Heading"],
            ["solution", "Solution Heading"],
            ["learned", "Learned Heading"],
          ].map(([key, label]) => (
            <Col md={4} key={key} className="mb-3">
              <Form.Label>{label}</Form.Label>
              <Form.Control
                name={key}
                value={formData[key]}
                onChange={handleChange}
              />
            </Col>
          ))}
        </Row>

        <Row>
          {[
            ["problemStatement", "Problem Statement"],
            ["solutionOverview", "Solution Overview"],
            ["whatIlearned", "What I Learned"],
          ].map(([key, label]) => (
            <Col md={4} key={key} className="mb-3">
              <Form.Label>{label}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name={key}
                value={formData[key]}
                onChange={handleChange}
              />
            </Col>
          ))}
        </Row>

        {/* Links */}
        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>Project Link</Form.Label>
            <Form.Control
              name="projectLink"
              value={formData.projectLink}
              onChange={handleChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>GitHub Link</Form.Label>
            <Form.Control
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* FAQ */}
        {formData.faq.map((item, index) => (
          <Row key={index}>
            <Col md={5} className="mb-3">
              <Form.Control
                placeholder="FAQ Question"
                value={item.question}
                onChange={(e) =>
                  handleFaqChange(index, "question", e.target.value)
                }
              />
            </Col>
            <Col md={5} className="mb-3">
              <Form.Control
                placeholder="FAQ Answer"
                value={item.answer}
                onChange={(e) =>
                  handleFaqChange(index, "answer", e.target.value)
                }
              />
            </Col>
            <Col md={2} className="mb-3 align-content-end">
              <Button variant="danger" onClick={() => removeFaq(index)}>
                Remove
              </Button>
            </Col>
          </Row>
        ))}

        <Button variant="secondary" onClick={addFaq}>
          Add FAQ
        </Button>

        <Button
          type="submit"
          className="mx-2"
          variant="success"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Project"}
        </Button>
      </Form>
    </Container>
  );
}
