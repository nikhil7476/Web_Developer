import React from "react";
import Link from "next/link";
import { Card, Col, Container, Row } from "react-bootstrap";

import ContactForm from "@/components/ContactForm";

import { MdEmail } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { FaClock, FaPhoneAlt } from "react-icons/fa";

/* =====================
   Contact Page
====================== */
function ContactMe() {
  return (
    <>
      {/* =====================
          Banner Section
      ====================== */}
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

      {/* =====================
          Contact Content
      ====================== */}
      <section>
        <Container>
          <Row>
            {/* =====================
                Contact Form
            ====================== */}
            <Col xl={8} lg={8} md={6} sm={12} xs={12} className="mb-3">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title as="h3">Send Us A Message</Card.Title>
                  <ContactForm />
                </Card.Body>
              </Card>
            </Col>

            {/* =====================
                Contact Details
            ====================== */}
            <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-3">
              <Card className="mb-3 shadow">
                <Card.Body>
                  <Card.Title as="h3">Contact Information</Card.Title>

                  {/* Email */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <MdEmail className="fs-2" />
                    <div className="d-flex flex-column">
                      <span className="mb-0 fs-6">Email</span>
                      <Link
                        href="mailto:hello@savory.com"
                        title="hello@savory.com"
                        className="mb-0 fs-6"
                      >
                        hello@savory.com
                      </Link>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <FaPhoneAlt className="fs-2" />
                    <div className="d-flex flex-column">
                      <span className="mb-0 fs-6">Phone</span>
                      <Link
                        href="tel:+1(555)123-4567"
                        title="+1 (555) 123-4567"
                        className="mb-0 fs-6"
                      >
                        +1{"(555)"}123-4567
                      </Link>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <IoLocation className="fs-2" />
                    <div className="d-flex flex-column">
                      <span className="mb-0 fs-6">Address</span>
                      <span className="mb-0 fs-6">
                        Culinary Street, Food City, FC 12345
                      </span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <FaClock className="fs-2" />
                    <div className="d-flex flex-column">
                      <span className="mb-0 fs-6">Hours</span>
                      <span className="mb-0 fs-6">
                        Mon - Fri: 9AM - 6PM EST
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* =====================
                  Extra Info
              ====================== */}
              <Card className="mb-3 shadow">
                <Card.Body>
                  <Card.Title as="h3">Recipe Suggestions?</Card.Title>
                  <Card.Text>
                    {"We're"} always looking for new recipe ideas! Share your
                    favorite dishes with us & see them featured on our blog.
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

export default ContactMe;
