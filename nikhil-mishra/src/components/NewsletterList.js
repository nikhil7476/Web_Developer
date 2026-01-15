import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { MdDelete } from "react-icons/md";

/* =====================
   Newsletter List Component
====================== */
export default function NewsletterList() {
  /* =====================
     State
  ====================== */
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     Fetch Subscribers
  ====================== */
  useEffect(() => {
    fetch("/api/newsletter/getSubscriber")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubscribers(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subscribers:", error);
        setLoading(false);
      });
  }, []);

  /* =====================
     Delete Subscriber
  ====================== */
  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to unsubscribe this email?"))
      return;

    try {
      const response = await fetch("/api/newsletter/deleteSubscriber", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubscribers((prev) =>
          prev.filter((subscriber) => subscriber.email !== email)
        );
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
    }
  };

  /* =====================
     Render
  ====================== */
  return (
    <Container>
      {loading ? (
        <p className="text-center">Loading subscribers...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Subscriber Email</th>
              <th>Date Subscribed</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.length > 0 ? (
              subscribers.map((subscriber, index) => (
                <tr key={subscriber._id}>
                  <td>{index + 1}</td>
                  <td>{subscriber.email}</td>
                  <td>{new Date(subscriber.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <MdDelete
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDelete(subscriber.email)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No subscribers found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
