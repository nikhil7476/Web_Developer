import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

/* =====================
   Blog Listing Page
====================== */
export default function BlogPage() {
  /* =====================
     State
  ====================== */
  const [blogs, setBlogs] = useState([]);

  /* =====================
     Fetch Blogs
  ====================== */
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
      {/* =====================
          Page Heading
      ====================== */}
      <h2 className="text-center mb-4 fw-bold">Latest Blogs</h2>

      {/* =====================
          Blog Grid
      ====================== */}
      <Row>
        {blogs.map((blog) => (
          <Col md={4} sm={6} xs={12} className="mb-4" key={blog._id}>
            <Card className="shadow-sm h-100">
              {/* =====================
                  Blog Image
              ====================== */}
              <Image
                src={blog.image}
                width={400}
                height={260}
                alt={blog.title}
                className="card-img-top"
                style={{ objectFit: "cover" }}
              />

              <Card.Body>
                {/* =====================
                    Title
                ====================== */}
                <h5 className="fw-bold">{blog.title}</h5>

                {/* =====================
                    Meta Info
                ====================== */}
                <p className="text-muted" style={{ fontSize: "14px" }}>
                  {new Date(blog.createdAt).toLocaleDateString()} —{" "}
                  {blog.author}
                </p>

                {/* =====================
                    Excerpt
                ====================== */}
                <p>{blog.excerpt.substring(0, 110)}...</p>

                {/* =====================
                    Tags
                ====================== */}
                <div className="mb-2">
                  {blog.tag.map((tag) => (
                    <Badge bg="secondary" className="me-1" key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* =====================
                    Read More
                ====================== */}
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

        {/* =====================
            Empty State
        ====================== */}
        {blogs.length === 0 && (
          <p className="text-center mt-4">No blogs published yet.</p>
        )}
      </Row>
    </Container>
  );
}
