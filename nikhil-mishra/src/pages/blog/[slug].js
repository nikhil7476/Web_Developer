import Image from "next/image";
import { Container, Badge } from "react-bootstrap";

/* =====================
   Server-Side Data Fetch
====================== */
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/getBlog?slug=${params.slug}`
    );

    const data = await res.json();

    if (!data.success || !data.data) {
      return { notFound: true };
    }

    return {
      props: {
        blog: data.data,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}

/* =====================
   Single Blog Page
====================== */
export default function SingleBlog({ blog }) {
  if (!blog) {
    return <p className="text-center mt-5">Blog not found</p>;
  }

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* =====================
          Title
      ====================== */}
      <h1 className="fw-bold">{blog.title}</h1>

      {/* =====================
          Meta Information
      ====================== */}
      <p className="text-muted" style={{ fontSize: "15px" }}>
        {new Date(blog.createdAt).toLocaleDateString()} • Written by{" "}
        {blog.author}
      </p>

      {/* =====================
          Tags
      ====================== */}
      <div className="mb-3">
        {(blog.tag || []).map((tag) => (
          <Badge bg="dark" className="me-2" key={tag}>
            {tag}
          </Badge>
        ))}
      </div>

      {/* =====================
          Featured Image
      ====================== */}
      {blog.image && (
        <div className="text-center mb-4">
          <Image
            src={blog.image}
            width={900}
            height={500}
            alt={blog.title}
            style={{
              objectFit: "cover",
              borderRadius: "10px",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      )}

      {/* =====================
          Quote
      ====================== */}
      {blog.quote && (
        <blockquote
          className="px-3 py-2"
          style={{
            borderLeft: "5px solid black",
            background: "#f3f3f3",
            fontStyle: "italic",
          }}
        >
          {blog.quote}
        </blockquote>
      )}

      {/* =====================
          Content
      ====================== */}
      <div
        className="mt-4"
        style={{ fontSize: "16px", lineHeight: "1.5" }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </Container>
  );
}
