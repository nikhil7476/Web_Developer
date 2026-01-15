import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";

/* =====================
   Dynamic Imports
====================== */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* =====================
   Blog List Component
====================== */
export default function BlogList() {
  /* =====================
     State
  ====================== */
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  /* =====================
     Fetch Blogs (Reusable)
  ====================== */
  const fetchBlogs = () => {
    setLoading(true);

    fetch("/api/blog/getBlog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBlogs(data.data);
        else if (Array.isArray(data)) setBlogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      });
  };

  /* =====================
     Initial Load
  ====================== */
  useEffect(() => {
    fetchBlogs();
  }, []);

  /* =====================
     Refresh on Blog Add
  ====================== */
  useEffect(() => {
    const handler = () => fetchBlogs();
    window.addEventListener("blogAdded", handler);

    return () => {
      window.removeEventListener("blogAdded", handler);
    };
  }, []);

  /* =====================
     Delete Blog
  ====================== */
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blog/deleteBlog?slug=${slug}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setBlogs((prev) => prev.filter((blog) => blog.slug !== slug));
        alert("Blog deleted successfully!");
      } else {
        alert(data.message || "Failed to delete blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred.");
    }
  };

  /* =====================
     Open Edit Modal
  ====================== */
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditBlog({
      ...blogs[index],
      tag: blogs[index].tag.join(", "),
    });
    setShowModal(true);
  };

  /* =====================
     Edit Field Change
  ====================== */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlog((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================
     Edit Image Change
  ====================== */
  const handleEditImageChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  /* =====================
     Update Blog
  ====================== */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      Object.keys(editBlog).forEach((key) => {
        if (key === "tag") {
          const tags = editBlog.tag.split(",").map((t) => t.trim());
          form.append("tag", JSON.stringify(tags));
        } else {
          form.append(key, editBlog[key]);
        }
      });

      if (editImageFile) {
        form.append("image", editImageFile);
      }

      const res = await fetch("/api/blog/updateBlog", {
        method: "PUT",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        setBlogs((prev) =>
          prev.map((blog, idx) => (idx === editIndex ? data.data : blog))
        );

        setShowModal(false);
        alert("Blog updated successfully!");
      } else {
        alert(data.message || "Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog.");
    }
  };

  /* =====================
     Render
  ====================== */
  return (
    <>
      <Container>
        {loading ? (
          <p className="text-center">Loading blogs...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Date</th>
                <th>Title</th>
                <th>Author</th>
                <th>Tags</th>
                <th>Quote</th>
                <th>Excerpt</th>
                <th>Slug</th>
                <th>Content</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <tr key={blog._id}>
                    <td>{index + 1}</td>
                    <td>{new Date(blog.createdAt).toLocaleString()}</td>
                    <td>{blog.title}</td>
                    <td>{blog.author}</td>
                    <td>{blog.tag.join(", ")}</td>
                    <td>{blog.quote}</td>
                    <td>{blog.excerpt}</td>
                    <td>{blog.slug}</td>

                    <td dangerouslySetInnerHTML={{ __html: blog.content }} />

                    <td>
                      <Image
                        src={blog.image}
                        alt={blog.slug}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover" }}
                      />
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
                        onClick={() => handleDelete(blog.slug)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    No blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* =====================
          Edit Blog Modal
      ====================== */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog: {editBlog.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={editBlog.title || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                name="author"
                value={editBlog.author || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                name="tag"
                value={editBlog.tag || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quote</Form.Label>
              <Form.Control
                name="quote"
                value={editBlog.quote || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                name="excerpt"
                value={editBlog.excerpt || ""}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <JoditEditor
                value={editBlog.content}
                onChange={(value) =>
                  setEditBlog((prev) => ({ ...prev, content: value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Update Image</Form.Label>
              <Form.Control type="file" onChange={handleEditImageChange} />

              {editBlog.image && (
                <Image
                  src={editBlog.image}
                  alt="Blog Featured Image"
                  title="Blog Featured Image"
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", marginTop: 10 }}
                />
              )}
            </Form.Group>

            <Button variant="success" type="submit">
              Update Blog
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
