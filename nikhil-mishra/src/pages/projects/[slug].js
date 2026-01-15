import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container, Row, Col, Badge, Button, Accordion } from "react-bootstrap";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function ProjectDetail() {
  const { slug } = useRouter().query;
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/project/getProject?slug=${slug}`);
        const data = await res.json();

        if (data?.success) {
          setProject(data.data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [slug]);

  if (!project) return null;

  return (
    <Container className="py-5">
      {/* Title */}
      <Row>
        <Col className="mb-3">
          <h1 className="fw-bold">{project.title}</h1>
          <p className="text-muted">{project.bannerDescription}</p>
        </Col>
      </Row>

      {/* Banner */}
      {project.bannerImage && (
        <Row>
          <Col className="mb-3">
            <Image
              src={project.bannerImage}
              alt={project.title}
              width={1200}
              height={500}
              className="rounded"
              style={{ objectFit: "cover", width: "100%" }}
            />
          </Col>
        </Row>
      )}

      {/* Tags & Links */}
      <Row>
        <Col md={8} className="mb-3 align-content-center">
          {project.tag?.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-2">
              {tag}
            </Badge>
          ))}
        </Col>

        <Col md={4} className="text-md-end mb-3 align-content-center">
          {project.githubLink && (
            <Button
              variant="outline-dark"
              className="me-2"
              href={project.githubLink}
              target="_blank"
            >
              <FaGithub className="me-1" />
              GitHub
            </Button>
          )}

          {project.projectLink && (
            <Button
              variant="outline-success"
              href={project.projectLink}
              target="_blank"
            >
              <FaExternalLinkAlt className="me-1" />
              Live
            </Button>
          )}
        </Col>
      </Row>

      {/* Problem */}
      <Row>
        <Col md={6} className="mb-3 align-content-center">
          <h4>{project.problem}</h4>
          <p>{project.problemStatement}</p>
        </Col>

        {project.problemImage && (
          <Col md={6} className="mb-3">
            <Image
              src={project.problemImage}
              alt="Problem"
              width={600}
              height={400}
              className="rounded"
              style={{ width: "100%" }}
            />
          </Col>
        )}
      </Row>

      {/* Solution */}
      <Row>
        {project.solutionImage && (
          <Col md={6} className="mb-3">
            <Image
              src={project.solutionImage}
              alt="Solution"
              width={600}
              height={400}
              className="rounded"
              style={{ width: "100%" }}
            />
          </Col>
        )}

        <Col md={6} className="mb-3 align-content-center">
          <h4>{project.solution}</h4>
          <p>{project.solutionOverview}</p>
        </Col>
      </Row>

      {/* Learnings */}
      <Row>
        <Col className="mb-3">
          <h4>{project.learned}</h4>
          <p>{project.whatIlearned}</p>
        </Col>
      </Row>

      {/* Gallery */}
      {project.galleryImages?.length > 0 && (
        <Row>
          {project.galleryImages.map((img, index) => (
            <Col md={4} key={index} className="mb-3">
              <Image
                src={img}
                alt={`Gallery ${index + 1}`}
                width={400}
                height={300}
                className="rounded"
                style={{ objectFit: "cover", width: "100%" }}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* FAQ */}
      {project.faq?.length > 0 && (
        <Row>
          <Col className="mb-3">
            <h4>FAQs</h4>
            <Accordion>
              {project.faq.map((item, index) => (
                <Accordion.Item eventKey={String(index)} key={index}>
                  <Accordion.Header>{item.question}</Accordion.Header>
                  <Accordion.Body>{item.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      )}
    </Container>
  );
}
