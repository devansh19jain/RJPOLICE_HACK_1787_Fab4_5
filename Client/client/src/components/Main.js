import React, { useState } from "react";
import { Container, Row, Col, Tab, Nav, Card, Button, Collapse, Form, Stack } from "react-bootstrap";
import sms from '../Assets/Images/sms.png';
import web from '../Assets/Images/web.png';
import { url } from '../url';
import axios from "axios";

export const Main = () => {
    const [open, setOpen] = useState(false);
    const [oopen, setOOpen] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [textareaValue2, setTextareaValue2] = useState('');
    const [predictionResult, setPredictionResult] = useState('');
    const [smsPredictionResult, setSmsPredictionResult] = useState(null);
    const [smsOpen, setSmsOpen] = useState(false);



    const handleReset = () => {
        setTextareaValue('');
       // setSmsPredictionResult(null); // Reset SMS prediction result
    };
    

    const handleReset2 = () => {
        setTextareaValue2('');
    };

    const characterCount = textareaValue.length;
    const isExceedingLimit = characterCount > 500;

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedText = textareaValue;
        console.log('Submitted Text:', submittedText);
        const smsPredicted = true;
        setSmsPredictionResult(smsPredicted);
        const requestsms = JSON.stringify({ sms_text: submittedText });
        const server = 'http://localhost:8080/spam'; // Change the port if needed
    
        axios.post(server, { sms_text: submittedText }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          const isSpam = response.data.isSpam;
    
          if (isSpam !== undefined) {
            setPredictionResult(isSpam ? 1 : -1);
          } else {
            console.error('Invalid response format from server');
          }
    
          // Set open to true after receiving the SMS prediction result
          // Assuming setOpen is a function that sets the state for your modal or alert
          setOpen(true);
    
          // Reset the form input
          handleReset();
        })
        .catch(error => {
          console.error('Axios error:', error);
        });
      };
    

    const handleSubmit2 = (e) => {
        e.preventDefault();
        const url_text = textareaValue2;
        console.log('URL:', url_text);
        const requestData = JSON.stringify({ url_text });

        const server = 'http://localhost:8080/';
        let url_domain = '';

        axios.post(server, requestData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            url_domain = response.data.hostname;
            const predicted = url(url_text, url_domain);
            // console.log(predicted.legitimatePercents);
            // console.log(predicted.predicted_value);
            if(!predicted)
            {
                setPredictionResult(1);
            }
            else
            {
                setPredictionResult(-1);
            }
           setOOpen(true);
        })
        .catch(error => {
            console.error('Axios error:', error);
        });
        handleReset2();
    };

    const handleCloseButtonClick = () => {
        setOOpen(!oopen);
        setPredictionResult(null); // Reset prediction result when closing the tab
    };
    const handleCloseButtonClick2 = () => {
        setSmsOpen(!smsOpen);
        setSmsPredictionResult(null); // Reset SMS prediction result when closing the tab
    };
    

    return (
        <section className="banner" id="main">
            <Container>
                <Row>
                    <Col>
                        <h2><strong>DETECT</strong></h2>
                        <br/>
                        {/* <p>"Explore my diverse portfolio of projects, each a testament to my passion for problem-solving and creativity. From web development to software engineering, discover the impact of my work."</p> */}
                        <Tab.Container id="projetcs-tabs" defaultActiveKey="first">
                            <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">SMS SPAM DETECTOR</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">WEB FRAUD DETECTOR</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content className="tb">
                            <Tab.Pane eventKey="first">
    <Row>
        <Card style={{ border: 'none', background: 'transparent' }}>
            <Card.Body style={{ background: '#c8c2c2', borderRadius: 15 }}>
                {smsOpen ? (
                    <div>
                        <Collapse in={smsOpen} dimension="width">
                            <div id="example-collapse-text" style={{ marginTop: '20px' }}>
                                <Card.Title style={{ textAlign: 'center', color: 'black', fontSize: 30, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>SMS SPAM DETECTOR</Card.Title>
                                {smsPredictionResult === true ? (
                                    <p style={{ textAlign: 'center', color: 'green', fontSize: 20 }}>Safe</p>
                                ) : smsPredictionResult === false ? (
                                    <p style={{ textAlign: 'center', color: 'red', fontSize: 20 }}>Unsafe</p>
                                ) : (
                                    <Stack direction="vertical" gap={3}>
                                        <Form.Control
                                            placeholder="Paste your SMS here..."
                                            as="textarea"
                                            rows={1}
                                            value={textareaValue}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 500) {
                                                    setTextareaValue(e.target.value);
                                                }
                                            }}
                                            style={{ borderColor: isExceedingLimit ? 'red' : undefined }}
                                        />
                                        <Stack direction="horizontal" gap={3} className="d-flex justify-content-center">
                                            <Button style={{ width: '100px', textAlign: 'center' }} variant="secondary" onClick={handleSubmit}>Submit</Button>
                                            <div className="vr" />
                                            <Button style={{ width: '100px', textAlign: 'center' }} variant="outline-danger" onClick={handleReset}>Reset</Button>
                                        </Stack>
                                        <div style={{ color: isExceedingLimit ? 'red' : undefined }}>
                                            Character Count: {characterCount} / 500
                                        </div>
                                    </Stack>
                                )}
                            </div>
                        </Collapse>
                    </div>
                ) : (
                    <div>
                        <Card.Img style={{ width: 450, height: 400, borderRadius: 15 }} variant="top" src={sms} />
                    </div>
                )}
            </Card.Body>
            <Card.Footer style={{ width: 475, background: 'transparent', border: 'none' }}>
                <Button
                    onClick={handleCloseButtonClick2}
                    aria-controls="example-collapse-text"
                    aria-expanded={smsOpen}
                    style={{ width: 100, height: 40,  background: 'linear-gradient(rgb(15,12,32) -5.91%, #9866b7 111.58%)', borderRadius: 15 }}
                >
                    {smsOpen ? "CLOSE" : "DETECT"}
                </Button>
            </Card.Footer>
        </Card>
    </Row>
</Tab.Pane>

                                <Tab.Pane eventKey="second">
    <Row>
        <Card style={{ border: 'none', background: 'transparent' }}>
            <Card.Body style={{ width: 475, background: '#c8c2c2', borderRadius: 15 }}>
                {oopen ? (
                    <div>
                        <Collapse in={oopen} dimension="width">
                            <div id="example-collapse-text" style={{ marginTop: '20px' }}>
                                <Card.Title style={{ textAlign: 'center', color: 'black', fontSize: 30, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>WEB FRAUD DETECTON</Card.Title>
                                {predictionResult === 1 ? (
                                    <p style={{ textAlign: 'center', color: 'green', fontSize: 20 }}>This is a Safe Website</p>
                                ) : predictionResult === -1 ? (
                                    <p style={{ textAlign: 'center', color: 'red', fontSize: 20 }}>Beware!!! This might be an Unsafe Website</p>
                                ) : (
                                    <Stack direction="vertical" gap={3}>
                                        <Form.Control
                                            className="me-auto"
                                            placeholder="Enter URL..."
                                            value={textareaValue2}
                                            onChange={(e) => setTextareaValue2(e.target.value)}
                                        />
                                        <Stack direction="horizontal" gap={3} className="d-flex justify-content-center">
                                            <Button style={{ width: '100px', textAlign: 'center' }} variant="secondary" onClick={handleSubmit2}>Submit</Button>
                                            <div className="vr" />
                                            <Button style={{ width: '100px', textAlign: 'center' }} variant="outline-danger" onClick={handleReset2}>Reset</Button>
                                        </Stack>
                                    </Stack>
                                )}
                            </div>
                        </Collapse>
                    </div>
                ) : (
                    <div>
                        <Card.Img style={{ width: 450, height: 400, borderRadius: 15 }} variant="top" src={web} />
                    </div>
                )}
            </Card.Body>
            <Card.Footer style={{ width: 475, background: 'transparent', border: 'none' }}>
            <Button
    onClick={oopen ? handleCloseButtonClick : () => setOOpen(!oopen)}
    aria-controls="example-collapse-text"
    aria-expanded={oopen}
    style={{ width: 100, height: 40,  background: 'linear-gradient(rgb(15,12,32) -5.91%, #9866b7 111.58%)', borderRadius: 15 }}
>
    {oopen ? "CLOSE" : "DETECT"}
</Button>

            </Card.Footer>
        </Card>
    </Row>
</Tab.Pane>


                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
