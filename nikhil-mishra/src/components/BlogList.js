import Image from "next/image";
import { useEffect, useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { MdDelete, MdEdit, MdCheck, MdCancel } from "react-icons/md";
import dynamic from "next/dynamic";

// Load JoditEditor only on client
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editBlog, setEditBlog] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    fetch("/api/blog/getBlog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs(data.data);
        } else if (Array.isArray(data)) {
          setBlogs(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog data:", err);
        setLoading(false);
      });
  }, []);

  // Delete Blog
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

  // Edit Click
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditBlog({ ...blogs[index], tag: blogs[index].tag.join(", ") });
  };

  // Edit Field Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image update in edit mode
  const handleEditImageChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  // Update Blog
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

        setEditIndex(null);
        alert("Blog updated successfully!");
      } else {
        alert(data.message || "Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("An error occurred while updating the blog.");
    }
  };

  return (
    <section>
      <Container>
        {loading ? (
          <p className="text-center">Loading blogs...</p>
        ) : (
          <Table striped bordered hover responsive className="mt-3">
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

                    {editIndex === index ? (
                      <>
                        {/* TITLE */}
                        <td>
                          <Form.Control
                            name="title"
                            value={editBlog.title}
                            onChange={handleEditChange}
                          />
                        </td>

                        {/* AUTHOR */}
                        <td>
                          <Form.Control
                            name="author"
                            value={editBlog.author}
                            onChange={handleEditChange}
                          />
                        </td>

                        {/* TAGS */}
                        <td>
                          <Form.Control
                            name="tag"
                            value={editBlog.tag}
                            onChange={handleEditChange}
                          />
                        </td>

                        {/* QUOTE */}
                        <td>
                          <Form.Control
                            name="quote"
                            value={editBlog.quote}
                            onChange={handleEditChange}
                          />
                        </td>

                        {/* EXCERPT */}
                        <td>
                          <Form.Control
                            name="excerpt"
                            value={editBlog.excerpt}
                            onChange={handleEditChange}
                          />
                        </td>

                        {/* SLUG (read-only) */}
                        <td>
                          <Form.Control
                            name="slug"
                            value={editBlog.slug}
                            disabled
                          />
                        </td>

                        {/* CONTENT - Jodit Editor */}
                        <td style={{ minWidth: "300px" }}>
                          <JoditEditor
                            value={editBlog.content}
                            onChange={(value) =>
                              setEditBlog({ ...editBlog, content: value })
                            }
                          />
                        </td>

                        {/* IMAGE UPLOAD */}
                        <td>
                          <Form.Control
                            type="file"
                            onChange={handleEditImageChange}
                          />
                          {editBlog.image && (
                            <Image
                              src={editBlog.image}
                              alt="Blog Image"
                              width={70}
                              height={70}
                              style={{ objectFit: "cover", marginTop: 6 }}
                            />
                          )}
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="text-center">
                          <MdCheck
                            style={{
                              color: "green",
                              cursor: "pointer",
                              marginRight: 8,
                            }}
                            onClick={handleUpdate}
                          />
                          <MdCancel
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => setEditIndex(null)}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{blog.title}</td>
                        <td>{blog.author}</td>
                        <td>{blog.tag.join(", ")}</td>
                        <td>{blog.quote}</td>
                        <td>{blog.excerpt}</td>
                        <td>{blog.slug}</td>

                        {/* Render HTML content safely */}
                        <td
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Blog Image */}
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
                      </>
                    )}
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
    </section>
  );
}
