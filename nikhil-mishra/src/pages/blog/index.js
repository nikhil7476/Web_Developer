import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/api/blog/getBlog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBlogs(data.data);
        else if (Array.isArray(data)) setBlogs(data);
      });
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 fw-bold">Latest Blogs</h2>

      <Row>
        {blogs.map((blog) => (
          <Col md={4} sm={6} xs={12} className="mb-4" key={blog._id}>
            <Card className="shadow-sm h-100">
              <Image
                src={blog.image}
                width={400}
                height={260}
                alt={blog.title}
                className="card-img-top"
                style={{ objectFit: "cover" }}
              />

              <Card.Body>
                <h5 className="fw-bold">{blog.title}</h5>

                <p className="text-muted" style={{ fontSize: "14px" }}>
                  {new Date(blog.createdAt).toLocaleDateString()} —{" "}
                  {blog.author}
                </p>

                <p>{blog.excerpt.substring(0, 110)}...</p>

                <div className="mb-2">
                  {blog.tag.map((t) => (
                    <Badge bg="secondary" className="me-1" key={t}>
                      {t}
                    </Badge>
                  ))}
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="btn btn-dark btn-sm mt-2"
                >
                  Read More →
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {blogs.length === 0 && (
          <p className="text-center mt-4">No blogs published yet.</p>
        )}
      </Row>
    </Container>
  );
}
