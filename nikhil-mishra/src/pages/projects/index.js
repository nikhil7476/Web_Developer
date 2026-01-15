import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project/getProject");
        const data = await res.json();

        if (data?.success) {
          setProjects(data.data);
        } else if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container>
      {/* Page Heading */}
      <Row>
        <Col className="mb-3">
          <h1 className="fw-bold text-center">Projects</h1>
          <p className="text-center text-muted">
            A collection of real-world projects I’ve built and learned from.
          </p>
        </Col>
      </Row>

      {/* Projects Grid */}
      <Row>
        {projects.map((project) => (
          <Col key={project._id} md={6} lg={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              {/* Banner Image */}
              {project.bannerImage && (
                <Image
                  src={project.bannerImage}
                  alt={project.title}
                  width={400}
                  height={220}
                  className="card-img-top"
                  style={{ objectFit: "cover" }}
                />
              )}

              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-semibold">{project.title}</Card.Title>

                <Card.Text className="text-muted small">
                  {project.bannerDescription}
                </Card.Text>

                {/* Tags */}
                <div className="mb-2">
                  {project.tag?.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Technologies */}
                <div className="mb-3">
                  <strong className="small">Tech Stack:</strong>
                  <p className="small mb-0">
                    {project.technologiesUsed?.join(", ")}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-auto d-flex gap-2">
                  <Link href={`/projects/${project.slug}`} passHref>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>

                  {project.githubLink && (
                    <Button
                      variant="outline-dark"
                      size="sm"
                      href={project.githubLink}
                      target="_blank"
                    >
                      <FaGithub />
                    </Button>
                  )}

                  {project.projectLink && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      href={project.projectLink}
                      target="_blank"
                    >
                      <FaExternalLinkAlt />
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
