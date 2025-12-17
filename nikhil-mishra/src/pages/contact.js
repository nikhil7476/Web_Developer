import ContactForm from "@/components/ContactForm";
import React from "react";
import Link from "next/link";
import {
  BsInstagram,
  BsPinterest,
  BsTwitterX,
  BsYoutube,
} from "react-icons/bs";
import { Card, Col, Container, Row } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { FaClock, FaPhoneAlt } from "react-icons/fa";

function Contact() {
  return (
    <>
      <section className="banner-section">
        <Container>
          <Row>
            <Col className="text-center">
              <span>Get in Touch</span>
              <h1>{"We'd"} Love to Hear From You</h1>
              <p>
                Whether you have a question, feedback, or just want to say
                hello, {"we're"} here for you. Send us a message and {"we'll"}{" "}
                respond as soon as possible. Send us a Message
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col xl={8} lg={8} md={6} sm={12} xs={12} className="mb-3">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title as="h3">Send Us A Message</Card.Title>
                  <Card.Text>
                    <ContactForm />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-3">
              <Card className="mb-3 shadow">
                <Card.Body>
                  <Card.Title as="h3">Contact Information</Card.Title>
                  <Card.Text>
                    <div className="d-flex align-items-center gap-3 mb-1">
                      <div>
                        <MdEmail className="fs-2" />
                      </div>
                      <div>
                        <h6 className="mb-0 fs-6">Email</h6>
                        <Link
                          href="mailto:hello@savory.com"
                          title="hello@savory.com"
                          className="mb-0 fs-6"
                        >
                          hello@savory.com
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-1">
                      <div>
                        <FaPhoneAlt className="fs-2" />
                      </div>
                      <div>
                        <h6 className="mb-0 fs-6">Phone</h6>
                        <Link
                          href="tel:+1(555)123-4567"
                          title="+1 (555) 123-4567"
                          className="mb-0 fs-6"
                        >
                          +1{"(555)"}123-4567
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-1">
                      <div>
                        <IoLocation className="fs-2" />
                      </div>
                      <div>
                        <h6 className="mb-0 fs-6">Address</h6>
                        <p className="mb-0 fs-6">
                          Culinary Street, Food City, FC 12345
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-1">
                      <div>
                        <FaClock className="fs-2" />
                      </div>
                      <div>
                        <h6 className="mb-0 fs-6">Hours</h6>
                        <p className="mb-0 fs-6">Mon - Fri: 9AM - 6PM EST</p>
                      </div>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className="mb-3 shadow">
                <Card.Body>
                  <Card.Title as="h4">Recipe Suggestions?</Card.Title>
                  <Card.Text>
                    <p>
                      {"We're"} always looking for new recipe ideas! Share your
                      favorite dishes with us and you might see them featured on
                      our blog.
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col className="text-center">
              <h2>Frequently Asked Questions</h2>
              <p>
                Find answers to common questions about our recipes and blog.
              </p>
            </Col>
          </Row>
          <Row>
            <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>Can I submit my own recipes?</Card.Title>
                  <Card.Text>
                    Absolutely! We love featuring recipes from our community.
                    Use the contact form above to share your creations.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>How often do you post new recipes?</Card.Title>
                  <Card.Text>
                    We publish new recipes every week, typically 2-3 times.
                    Subscribe to our newsletter to never miss a new recipe.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>Can I print the recipes?</Card.Title>
                  <Card.Text>
                    Yes! Every recipe page has a print button that formats the
                    recipe perfectly for printing.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>
                    Do you accommodate dietary restrictions?
                  </Card.Title>
                  <Card.Text>
                    We include options for various dietary needs. Look for tags
                    like vegetarian, gluten-free, and dairy-free.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Contact;
