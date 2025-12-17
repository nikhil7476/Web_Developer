import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  BsInstagram,
  BsPinterest,
  BsTwitterX,
  BsYoutube,
} from "react-icons/bs";
import NewsletterForm from "./NewsletterForm";

function Footer() {
  return (
    <>
      <section className="footer">
        <Container>
          <Row>
            <Col xl={4} lg={3} md={6} sm={12} xs={12} className="mb-3">
              <h3>Savory.</h3>
              <p>
                Discover delicious recipes, cooking tips, & culinary inspiration
                for every meal. From quick weeknight dinners to impressive
                desserts.
              </p>
              <ul className="list-unstyled d-flex gap-3 mb-0 socialIcon">
                <li>
                  <Link href="https://www.instagram.com/" title="Instagram">
                    <BsInstagram />
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/" title="Twitter">
                    <BsTwitterX />
                  </Link>
                </li>
                <li>
                  <Link href="https://www.pinterest.com/" title="Pinterest">
                    <BsPinterest />
                  </Link>
                </li>
                <li>
                  <Link href="https://youtube.com/" title="Youtube">
                    <BsYoutube />
                  </Link>
                </li>
              </ul>
            </Col>
            <Col xl={2} lg={3} md={6} sm={12} xs={12} className="mb-3">
              <h4>Quick Links</h4>
              <ul className="list-unstyled mb-0 ftrLink">
                <li>
                  <Link href="/" title="Home">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" title="About">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" title="Recipes">
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/contact" title="Contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </Col>
            <Col xl={2} lg={3} md={6} sm={12} xs={12} className="mb-3">
              <h4>Categories</h4>
              <ul className="list-unstyled mb-0 ftrLink">
                <li>
                  <Link href="#" title="New Arrivals">
                    Breakfast
                  </Link>
                </li>
                <li>
                  <Link href="#" title="Lunch">
                    Lunch
                  </Link>
                </li>
                <li>
                  <Link href="#" title="Dinner">
                    Dinner
                  </Link>
                </li>
                <li>
                  <Link href="#" title="Desserts">
                    Desserts
                  </Link>
                </li>
              </ul>
            </Col>
            <Col xl={4} lg={3} md={6} sm={12} xs={12} className="mb-3">
              <h4>Newsletter</h4>
              <p>
                Subscribe for new recipes & cooking tips delivered to your
                inbox.
              </p>
              <NewsletterForm />
            </Col>
          </Row>
          <Row className="copyFooter">
            <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
              <p className="mb-0">
                &copy;{new Date().getFullYear()} Savory. All Rights Reserved.
                Designed By Nikhil Mishra.
              </p>
            </Col>
            <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
              <ul className="list-unstyled d-flex gap-4 justify-content-end mb-0 ftrLink">
                <li>
                  <Link href="#" title="Privacy Policy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" title="Terms of Service">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Footer;
