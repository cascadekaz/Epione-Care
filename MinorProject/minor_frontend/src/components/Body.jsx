import React from "react";
import hero from '../assets/hero.png'
import './Body.css';

const Body=()=>{
    return (
        <div className="body-div">
            <div className="heroimg">
                <p><img src={hero} alt="hero"></img></p>
            </div>
            <div className="text">
                <h1><p>FOR ILLNESS.</p></h1>
                <h1><p>FOR WELLNESS.</p></h1>
                <h1><p className="always">FOR ALWAYS.</p></h1>
                <div className="decription">
                <p>Epione Care is a progressive hub of medical services,
                providing exceptional primary care and engaging you in proactive health solutions.
                Welcome to the community-focused family medical practice. </p>
                <h4><a href="/book-now">BOOK AN APPOINTMENT NOW</a></h4>
                </div>
                
            </div>
        </div>
    )
}

export default Body;