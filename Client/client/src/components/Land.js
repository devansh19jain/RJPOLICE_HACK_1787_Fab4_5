import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import bannerimg from "../Assets/Images/img.png";
import bannerimg2 from "../Assets/Images/img2.png";

export const Banner = () =>{
    return (
        <section className="land" id="home">
            <Container>
                {/* <Col className="align-item-center"> */}
                    {/* <Col className="txt">
                        <span className="tagline"><strong>Your sheild against online threats <br />Detecting phishing websites for a safer digital experience</strong></span>
                    </Col> */}
                    {/* <Col className="im">
                        <img className="img1" src= {bannerimg} alt="Header Img"/>
                        <button
                            style={{
                                width: 150,
                                height: 70,
                                background: '#79A2CB',
                                borderRadius: 20,
                                display: 'block',
                                margin: '20px 570px', 
                            }}
                            >
                            <strong>About Us</strong>
                        </button> */}
                    {/* </Col> */}
                {/* </Col> */}
                <span className="tagline">CYBERGUARD</span>
                        <h1>Your shield against online threats!!</h1>
                        <br/>
                        {/* <span className="wrap">A Devansh</span></h1> */}
                        <p>Detecting phishing websites for a safer digital experience </p>
                        {/* <p>With a robust Computer Science education, I adeptly apply theoretical knowledge to practical projects, fostering problem-solving skills. Quick to grasp new concepts, I stay updated on industry trends, showcasing responsibility, drive, and leadership prowess.</p> */}
                        
            </Container>

        </section>
    )
}