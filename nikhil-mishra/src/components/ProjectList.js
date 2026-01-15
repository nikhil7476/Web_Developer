import Image from "next/image";
import Link from "next/link";
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
        <Row>
          <Col className="mb-3">
            <h2>Project List</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <p className="text-center">Loading projects...</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-nowrap">#</th>
                    <th className="text-nowrap">Title</th>
                    <th className="text-nowrap">Slug</th>
                    <th className="text-nowrap">Banner Desc</th>
                    <th className="text-nowrap">Tags</th>
                    <th className="text-nowrap">Features</th>
                    <th className="text-nowrap">Technologies</th>
                    <th className="text-nowrap">Technology Imgs</th>
                    <th className="text-nowrap">Gallery Imgs</th>
                    <th className="text-nowrap">Featured Img</th>
                    <th className="text-nowrap">Banner Img</th>
                    <th className="text-nowrap">Problem Img</th>
                    <th className="text-nowrap">Problem Heading</th>
                    <th className="text-nowrap">Problem Statement</th>
                    <th className="text-nowrap">Solution Img</th>
                    <th className="text-nowrap">Solution Heading</th>
                    <th className="text-nowrap">Solution Overview</th>
                    <th className="text-nowrap">Learned Heading</th>
                    <th className="text-nowrap">What I Learned</th>
                    <th className="text-nowrap">Project Link</th>
                    <th className="text-nowrap">GitHub Link</th>
                    <th className="text-nowrap">FAQ Questions</th>
                    <th className="text-nowrap">FAQ Answers</th>
                    <th className="text-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.length ? (
                    projects.map((project, index) => (
                      <tr key={project._id}>
                        <td>{index + 1}</td>
                        <td>{project.title}</td>
                        <td>{project.slug}</td>
                        <td>{project.bannerDescription}</td>
                        <td>{project.tag.join(", ")}</td>
                        <td>{project.featureList.join(", ")}</td>
                        <td>{project.technologiesUsed.join(", ")}</td>
                        <td>
                          {project.technologiesUsedImages.map((img, i) => (
                            <Image
                              key={i}
                              src={img}
                              alt={`Tech ${i}`}
                              title={`Tech ${i}`}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover", marginRight: 4 }}
                            />
                          ))}
                        </td>
                        <td>
                          {project.galleryImages.map((img, i) => (
                            <Image
                              key={i}
                              src={img}
                              alt={`Gallery ${i}`}
                              title={`Gallery ${i}`}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover", marginRight: 4 }}
                            />
                          ))}
                        </td>
                        <td>
                          {project.featuredImage && (
                            <Image
                              src={project.featuredImage}
                              alt={`Featured ${project.title}`}
                              title={`Featured ${project.title}`}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>
                          {project.bannerImage && (
                            <Image
                              src={project.bannerImage}
                              alt={`${project.title} Banner Image`}
                              title={`${project.title} Banner Image`}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>
                          {project.problemImage && (
                            <Image
                              src={project.problemImage}
                              alt={`${project.title} Problem Image`}
                              title={`${project.title} Problem Image`}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>{project.problem}</td>
                        <td>{project.problemStatement}</td>
                        <td>
                          {project.solutionImage && (
                            <Image
                              src={project.solutionImage}
                              alt={`${project.title} Solution Image`}
                              title={`${project.title} Solution Image`}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>{project.solution}</td>
                        <td>{project.solutionOverview}</td>
                        <td>{project.learned}</td>
                        <td>{project.whatIlearned}</td>
                        <td>
                          <Link
                            href={project.projectLink}
                            target="_blank"
                            title="Live URL"
                          >
                            {project.projectLink}
                          </Link>
                        </td>
                        <td>
                          <Link
                            href={project.githubLink}
                            target="_blank"
                            title="GitHub Repo URL"
                          >
                            {project.githubLink}
                          </Link>
                        </td>
                        <td>
                          {project.faq && project.faq.length
                            ? project.faq.map((item, index) => (
                                <div key={index}>
                                  <strong>{item.question}</strong>
                                  {index !== project.faq.length - 1 && <hr />}
                                </div>
                              ))
                            : "No FAQ"}
                        </td>

                        <td>
                          {project.faq && project.faq.length
                            ? project.faq.map((item, index) => (
                                <div key={index}>
                                  <span>{item.answer}</span>
                                  {index !== project.faq.length - 1 && <hr />}
                                </div>
                              ))
                            : "No FAQ"}
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
          </Col>
        </Row>
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
            {/* ================= BASIC INFO ================= */}
            <h5 className="mb-3">Basic Information</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    name="title"
                    value={editProject.title || ""}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug *</Form.Label>
                  <Form.Control
                    name="slug"
                    value={editProject.slug || ""}
                    onChange={handleEditChange}
                    required
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

            {/* ================= TAGS / FEATURES ================= */}
            <h5 className="mt-4 mb-3">Metadata</h5>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                name="tag"
                value={editProject.tag || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Feature List (comma separated)</Form.Label>
              <Form.Control
                name="featureList"
                value={editProject.featureList || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Technologies Used (comma separated)</Form.Label>
              <Form.Control
                name="technologiesUsed"
                value={editProject.technologiesUsed || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* ================= PROBLEM ================= */}
            <h5 className="mt-4 mb-3">Problem Section</h5>

            <Form.Group className="mb-3">
              <Form.Label>Problem Heading</Form.Label>
              <Form.Control
                name="problem"
                value={editProject.problem || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Problem Statement</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="problemStatement"
                value={editProject.problemStatement || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* ================= SOLUTION ================= */}
            <h5 className="mt-4 mb-3">Solution Section</h5>

            <Form.Group className="mb-3">
              <Form.Label>Solution Heading</Form.Label>
              <Form.Control
                name="solution"
                value={editProject.solution || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Solution Overview</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="solutionOverview"
                value={editProject.solutionOverview || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* ================= LEARNING ================= */}
            <h5 className="mt-4 mb-3">Learnings</h5>

            <Form.Group className="mb-3">
              <Form.Label>Learned Heading</Form.Label>
              <Form.Control
                name="learned"
                value={editProject.learned || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>What I Learned</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="whatIlearned"
                value={editProject.whatIlearned || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            {/* ================= LINKS ================= */}
            <h5 className="mt-4 mb-3">Links</h5>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Live Project URL</Form.Label>
                  <Form.Control
                    name="projectLink"
                    value={editProject.projectLink || ""}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub Repository URL</Form.Label>
                  <Form.Control
                    name="githubLink"
                    value={editProject.githubLink || ""}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* ================= IMAGES ================= */}
            <h5 className="mt-4 mb-3">Update Images</h5>

            <Form.Group className="mb-3">
              <Form.Label>Featured Image</Form.Label>
              <Form.Control
                type="file"
                name="featuredImage"
                onChange={handleEditImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                name="bannerImage"
                onChange={handleEditImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Problem Image</Form.Label>
              <Form.Control
                type="file"
                name="problemImage"
                onChange={handleEditImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Solution Image</Form.Label>
              <Form.Control
                type="file"
                name="solutionImage"
                onChange={handleEditImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gallery Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                name="galleryImages"
                onChange={handleEditImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Technology Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                name="technologiesUsedImages"
                onChange={handleEditImageChange}
              />
            </Form.Group>

            {/* ================= ACTION ================= */}
            <div className="text-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Update Project
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
