import Image from "next/image";
import { Container, Badge } from "react-bootstrap";

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/getBlog?slug=${params.slug}`
    );

    const data = await res.json();

    // Ensure response is valid
    if (!data.success || !Array.isArray(data.data)) {
      return { notFound: true };
    }

    // Find blog matching slug
    const blog = data.data.find(
      (item) => item.slug.toLowerCase() === params.slug.toLowerCase()
    );

    if (!blog) {
      return { notFound: true };
    }

    return {
      props: { blog },
    };
  } catch (error) {
    return { notFound: true };
  }
}

export default function SingleBlog({ blog }) {
  // Safety check
  if (!blog) return <p className="text-center mt-5">Blog not found</p>;

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* Title */}
      <h1 className="fw-bold">{blog.title}</h1>

      {/* Meta info */}
      <p className="text-muted" style={{ fontSize: "15px" }}>
        {new Date(blog.createdAt).toLocaleDateString()} • Written by{" "}
        {blog.author}
      </p>

      {/* Tags */}
      <div className="mb-3">
        {(blog.tag || []).map((t) => (
          <Badge bg="dark" className="me-2" key={t}>
            {t}
          </Badge>
        ))}
      </div>

      {/* Image */}
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

      {/* Quote */}
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

      {/* Content */}
      <div
        className="mt-4"
        style={{ fontSize: "18px", lineHeight: "1.7" }}
        dangerouslySetInnerHTML={{ __html: blog.content || "" }}
      ></div>
    </Container>
  );
}
