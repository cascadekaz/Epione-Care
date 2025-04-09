import React from 'react';
import './Footer.css';
import fb from '../assets/facebook.png'
import twitter from '../assets/twitter.png'
import insta from '../assets/instagram.png'

const Footer = () => {
  return (
    <div className="footer">
        <div className="sb__footer section__padding">
            <div className="sb__footer-links">
                <div className="sb__footer-links-div">
                    <h4>For Business</h4>
                    <a href="/"><p>Employer</p></a>
                    <a href="/"><p>Employer</p></a>
                    <a href="/"><p>Employer</p></a>
                </div>
                <div className="sb__footer-links-div">
                    <h4>For Business</h4>
                    <a href="/"><p>Employer</p></a>
                    <a href="/"><p>Employer</p></a>
                    <a href="/"><p>Employer</p></a>
                </div>
                <div className="sb__footer-links-div">
                    <h4>For Business</h4>
                    <a href="/"><p>Employer</p></a>
                    <a href="/"><p>Employer</p></a>
                    <a href="/"><p>Employer</p></a>
                </div>
                <div className="sb__footer-links-div">
                    <h4>Coming soon on</h4>
                    <div className="socialmedia">
                        <p><img src={fb} alt="fb"></img></p>
                        <p><img src={twitter} alt="twt"></img></p>
                        <p><img src={insta} alt="ig"></img></p>
                    </div>
                </div>
            </div>

            <hr></hr>
            <div className="sb__footer-below">
                <div className="sb__footer-copyright">
                    <p>
                        @{new Date().getFullYear()} Epione Care. All rights reserved.
                    </p>
                </div>
                <div className="sb__footer-below-links">
                    <a href="/"><div><p>Terms and Conditions</p></div></a>
                    <a href="/"><div><p>Privacy</p></div></a>
                    <a href="/"><div><p>Security</p></div></a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Footer;
