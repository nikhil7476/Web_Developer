import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";

/* =====================
   Project List Component
====================== */
export default function ProjectList() {
  /* =====================
     State
  ====================== */
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState({});
  const [editImages, setEditImages] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  /* =====================
     Fetch Projects
  ====================== */
  const fetchProjects = () => {
    setLoading(true);

    fetch("/api/project/getProject")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
        else if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  };

  /* =====================
     Initial Load
  ====================== */
  useEffect(() => {
    fetchProjects();
  }, []);

  /* =====================
     Refresh on Add
  ====================== */
  useEffect(() => {
    const handler = () => fetchProjects();
    window.addEventListener("projectAdded", handler);
    return () => window.removeEventListener("projectAdded", handler);
  }, []);

  /* =====================
     Delete Project
  ====================== */
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const res = await fetch(`/api/project/deleteProject?slug=${slug}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.slug !== slug));
        alert("Project deleted successfully!");
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting project");
    }
  };

  /* =====================
     Open Edit Modal
  ====================== */
  const handleEditClick = (index) => {
    const project = projects[index];

    setEditIndex(index);
    setEditProject({
      ...project,
      tag: project.tag.join(", "),
      featureList: project.featureList.join(", "),
      technologiesUsed: project.technologiesUsed.join(", "),
    });

    setEditImages({});
    setShowModal(true);
  };

  /* =====================
     Edit Field Change
  ====================== */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProject((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================
     Edit Image Change
  ====================== */
  const handleEditImageChange = (e) => {
    const { name, files } = e.target;
    setEditImages((prev) => ({
      ...prev,
      [name]: files.length > 1 ? Array.from(files) : files[0],
    }));
  };

  /* =====================
     Update Project
  ====================== */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      /* Core */
      form.append("title", editProject.title);
      form.append("slug", editProject.slug);
      form.append("bannerDescription", editProject.bannerDescription);

      /* Arrays */
      form.append(
        "tag",
        JSON.stringify(editProject.tag.split(",").map((t) => t.trim()))
      );
      form.append(
        "featureList",
        JSON.stringify(editProject.featureList.split(",").map((f) => f.trim()))
      );
      form.append(
        "technologiesUsed",
        JSON.stringify(
          editProject.technologiesUsed.split(",").map((t) => t.trim())
        )
      );

      /* Content */
      [
        "problem",
        "problemStatement",
        "solution",
        "solutionOverview",
        "learned",
        "whatIlearned",
      ].forEach((key) => form.append(key, editProject[key] || ""));

      /* Links */
      form.append("projectLink", editProject.projectLink || "");
      form.append("githubLink", editProject.githubLink || "");

      /* FAQ */
      form.append("faq", JSON.stringify(editProject.faq || []));

      /* Images */
      Object.entries(editImages).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((file) => form.append(key, file));
        } else {
          form.append(key, value);
        }
      });

      const res = await fetch("/api/project/updateProject", {
        method: "PUT",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        setProjects((prev) =>
          prev.map((p, i) => (i === editIndex ? data.data : p))
        );
        setShowModal(false);
        alert("Project updated successfully!");
      } else {
        alert(data.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating project");
    }
  };

  /* =====================
     Render
  ====================== */
  return (
    <>
      <Container>
        {loading ? (
          <p className="text-center">Loading projects...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Tags</th>
                <th>Technologies</th>
                <th>Banner</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.length ? (
                projects.map((project, index) => (
                  <tr key={project._id}>
                    <td>{index + 1}</td>
                    <td>{project.title}</td>
                    <td>{project.slug}</td>
                    <td>{project.tag.join(", ")}</td>
                    <td>{project.technologiesUsed.join(", ")}</td>
                    <td>
                      {project.bannerImage && (
                        <Image
                          src={project.bannerImage}
                          alt={project.slug}
                          width={80}
                          height={80}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </td>
                    <td className="text-center">
                      <MdEdit
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          marginRight: 8,
                        }}
                        onClick={() => handleEditClick(index)}
                      />
                      <MdDelete
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(project.slug)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* =====================
          Edit Project Modal
      ====================== */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={editProject.title || ""}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    name="slug"
                    value={editProject.slug || ""}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Banner Description</Form.Label>
              <Form.Control
                name="bannerDescription"
                value={editProject.bannerDescription || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                name="tag"
                value={editProject.tag || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              <Form.Control
                name="featureList"
                value={editProject.featureList || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Technologies Used</Form.Label>
              <Form.Control
                name="technologiesUsed"
                value={editProject.technologiesUsed || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Update Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                name="galleryImages"
                onChange={handleEditImageChange}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Update Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
