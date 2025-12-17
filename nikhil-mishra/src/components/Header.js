import { Col, Container, Nav, Navbar, Offcanvas, Row } from "react-bootstrap";
import Image from "next/image";

function Header() {
  const expand = "lg";

  return (
    <>
      <section className="main-header shadow">
        <Container>
          <Row>
            <Col>
              <Navbar expand={expand}>
                <Container fluid>
                  <Navbar.Brand href="/" title="Savory.">
                    <Image
                      src="/nikhil-logo.webp"
                      alt="Savory."
                      title="Savory."
                      width={50}
                      height={50}
                      className="rounded-circle shadow"
                    />{" "}
                    Savory.
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
                          alt="Savory."
                          title="Savory."
                          width={50}
                          height={50}
                          className="rounded-circle shadow"
                        />{" "}
                        Savory.
                      </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                      <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link href="/" title="Home">
                          Home
                        </Nav.Link>
                        <Nav.Link href="/about" title="About">
                          About
                        </Nav.Link>
                        <Nav.Link href="/blog" title="Recipes">
                          Recipes
                        </Nav.Link>
                        <Nav.Link href="/contact" title="Contact">
                          Contact
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
