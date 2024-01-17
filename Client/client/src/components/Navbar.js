import { useState , useEffect} from "react";
import { Navbar,Container, Nav} from "react-bootstrap";
import { HashLink } from 'react-router-hash-link';
import {
  BrowserRouter as Router
} from "react-router-dom";

export const NavBar=() =>
{
    const [activeLink, setActiveLink] = useState('home');
    const [scrolled, setscrolled] = useState(false); 

    useEffect( ()=>{
        const onScroll = () => {
            if(window.scrollY >50)
            {
                setscrolled(true);
            }
            else{
                setscrolled(false);
            }
        }
        window.addEventListener("scroll", onScroll);
        return () =>window.removeEventListener("scroll",onScroll);
    }, [])

    const onUpdateActiveLink =(value) =>
    {
        setActiveLink(value);
    }
  return (
    <Router>
      <Navbar expand="md" className={scrolled ? "scrolled": ""}>
        <Container>
        <Navbar.Brand href="#home" className="brand"><strong>CYBERGUARD</strong></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" >
              <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link as = {HashLink} to="#home" smooth className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')} >Home</Nav.Link>
              <Nav.Link as = {HashLink} to="#skill" smooth className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link> */}
            </Nav>
            <Nav>
            <Nav.Link as = {HashLink} to="#main" smooth className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')} ><strong>DETECT</strong></Nav.Link>
            <Nav.Link as = {HashLink} to="#home" smooth className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')} ><strong>EXTENSION</strong></Nav.Link>
            <a  style={{color:'white', fontWeight:'400', fontSize:'1'}} href="https://cybercrime.gov.in/webform/crime_onlinesafetytips.aspx"><strong>GUIDELINES</strong></a>
            </Nav>
            {/* <span className="navbar-text">
              <HashLink to='#connect'>
              <button className="vvd"><span>Let's Connect</span></button>
              </HashLink> 
            </span> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>  
  );
}