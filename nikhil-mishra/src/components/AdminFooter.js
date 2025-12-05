import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function Footer() {
  return (
    <>
      <section className="p-2 mt-3" style={{ background: "#212529" }}>
        <Container>
          <Row>
            <Col>
              <p className="text-center text-white small m-0">
                Copyright &copy; {new Date().getFullYear()} Niktech Pvt Ltd
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Footer;
