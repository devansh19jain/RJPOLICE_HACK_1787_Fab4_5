import { Container, Row, Col } from "react-bootstrap";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col>
            <p>Copyright (c) 2024 CyberGuard</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}