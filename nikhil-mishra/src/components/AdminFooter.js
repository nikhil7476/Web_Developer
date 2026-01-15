import React from "react";
import { Col, Container, Row } from "react-bootstrap";

/* =====================
   Footer Component
====================== */
function Footer() {
  return (
    <>
      {/* =====================
          Footer Section
      ====================== */}
      <section className="p-2 mt-3" style={{ background: "#212529" }}>
        <Container>
          <Row>
            <Col>
              <p className="text-center text-white small m-0">
                &copy;{new Date().getFullYear()} Savory. All Rights Reserved.
                Designed By Nikhil Mishra.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Footer;
