import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  Form,
  Button,
  Container,
  Alert,
  Spinner,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid username or password");
      }

      sessionStorage.setItem("isAdmin", "true");
      router.replace("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Niktech</title>
        <meta
          name="description"
          content="Login to Exploring Ideas, One Thought at a Time"
        />
      </Head>

      <section style={{ height: "100vh", alignContent: "center" }}>
        <Container>
          <Row>
            <Col
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className="align-content-center mb-3"
            >
              <Link href="/" title="Nikhil Mishra">
                <Image
                  src="/nikhil-logo.webp"
                  alt="Nikhil Mishra"
                  title="Nikhil Mishra"
                  width={460}
                  height={460}
                  style={{ width: "75%", height: "auto" }}
                />
              </Link>
            </Col>

            <Col
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className="align-content-center mb-3"
            >
              <h1 className="mb-4">Login To The Dashboard</h1>

              <Form
                onSubmit={handleLogin}
                className="p-4 border rounded shadow"
              >
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <InputGroup.Text
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  disabled={loading}
                  className="w-100"
                  title="Login"
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
