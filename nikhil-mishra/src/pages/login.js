import { useState } from "react";
import { useRouter } from "next/router";
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
import Head from "next/head";

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
        <title>Login - Ikken</title>
        <meta
          name="description"
          content="Login to Exploring Ideas, One Thought at a Time"
        />
      </Head>

      <section>
        <Container>
          <Row className="justify-content-center mt-4 mb-4">
            <Col xl={5} lg={5} md={5} sm={12}>
              <Image
                src="/nikhil-logo.webp"
                alt="Nikhil Mishra"
                title="Nikhil Mishra"
                width={460}
                height={460}
                style={{ width: "75%", height: "auto" }}
              />
            </Col>

            <Col xl={5} lg={5} md={5} sm={12}>
              <h1 className="mb-4">Login</h1>

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
                  variant="secondary"
                  type="submit"
                  disabled={loading}
                  className="w-100"
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
