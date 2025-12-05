import { Col, Container, Nav, Navbar, Offcanvas, Row } from "react-bootstrap";
import Image from "next/image";

function Header() {
  const expand = "lg";

  return (
    <>
      <section className="main-header fixed-top bg-white shadow">
        <Container>
          <Row>
            <Col>
              <Navbar expand={expand}>
                <Container fluid>
                  <Navbar.Brand href="/" title="Nikhil Mishra">
                    <Image
                      src="/nikhil-logo.webp"
                      alt="Nikhil Mishra"
                      title="Nikhil Mishra"
                      width={50}
                      height={50}
                      className="rounded-circle shadow"
                    />{" "}
                    Nikhil Mishra
                  </Navbar.Brand>
                  <Navbar.Toggle
                    aria-controls={`offcanvasNavbar-expand-${expand}`}
                  />
                  <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title
                        id={`offcanvasNavbarLabel-expand-${expand}`}
                      >
                        <Image
                          src="/nikhil-logo.webp"
                          alt="Nikhil Mishra"
                          title="Nikhil Mishra"
                          width={50}
                          height={50}
                          className="rounded-circle shadow"
                        />{" "}
                        Nikhil Mishra
                      </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                      <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link href="/" title="Home">
                          Home
                        </Nav.Link>
                        <Nav.Link href="/about-us" title="About Us">
                          About Us
                        </Nav.Link>
                        <Nav.Link href="/services" title="Services">
                          Services
                        </Nav.Link>
                        <Nav.Link href="/portfolio" title="Portfolio">
                          Portfolio
                        </Nav.Link>
                        <Nav.Link href="/blog" title="Articles">
                          Articles
                        </Nav.Link>
                        <Nav.Link href="/contact-us" title="Contact Us">
                          Contact Us
                        </Nav.Link>
                      </Nav>
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Container>
              </Navbar>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Header;
