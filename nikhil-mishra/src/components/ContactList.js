import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { MdDelete } from "react-icons/md";

/* =====================
   Contact List Component
====================== */
export default function ContactList() {
  /* =====================
     State
  ====================== */
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     Fetch Contacts
  ====================== */
  useEffect(() => {
    fetch("/api/contacts/getContact")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContacts(data);
        } else if (data.success && Array.isArray(data.data)) {
          setContacts(data.data);
        } else {
          console.error("Unexpected API response format:", data);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contact data:", error);
        setLoading(false);
      });
  }, []);

  /* =====================
     Delete Contact
  ====================== */
  const handleDelete = async (email) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/contacts/deleteContact?email=${email}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setContacts((prev) =>
          prev.filter((contact) => contact.email !== email)
        );
        alert("Contact deleted successfully!");
      } else {
        alert(data.message || "Failed to delete contact.");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("An error occurred while deleting the contact.");
    }
  };

  /* =====================
     Render
  ====================== */
  return (
    <Container>
      {loading ? (
        <p className="text-center">Loading contacts...</p>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr key={contact._id}>
                  <td>{index + 1}</td>
                  <td>{new Date(contact.createdAt).toLocaleString()}</td>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.message_content}</td>
                  <td className="text-center">
                    <MdDelete
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDelete(contact.email)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
