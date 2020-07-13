import React, {useState, useEffect} from 'react'; 
import {connect} from "react-redux";
import {Link, useHistory} from "react-router-dom"; 
import axios from "axios";
import {Button, Col, Row, Container} from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node'; 
import SpotifyLogo from "../photos/Spotify_Logo_RGB_Green.png"
import {setName, setRoom} from "./loginSlice"; 
import "./login.css"
import {endpoint} from "../socket";

function Login({name, room, setName, setRoom}) { 
    const [errors, setErrors] = useState(""); 
    const history = useHistory();

    function Authorize(name, room, admin) { 
    

        const adminbit =  admin ? 1 : 0   
        const state = adminbit +  room + name
        axios.post(endpoint + "/authorize", {
            state: state
        }).then(
            res => window.open(res.data.url, "_self"))        
    }
    
    function joinTeam() { 
        if (room.length != 7 || name.length == 0) { 
            alert("The length of the room must be 7 letters long")
        } else if(name.length == 0) {
            alert('You must enter a name')
        } else { 
            Authorize(name, room, false); 
        }
    }

    function createTeam() { 
        if (name.length == 0) { 
            alert("You must enter a name")
        } else {
            const roomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            Authorize(name, roomName.slice(0, 7), true);
        }
    }

    return (
        <div className = "loginContainer"> 
        <Container fluid = "md">
           <img src = {SpotifyLogo} />
           <Row> 
               <Col md = {4}> </Col>
                <Col md = {4} sm = {12} className = "login" > 
                    <input  
                        type= "text"
                        placeholder = "Name"
                        onChange = {(event) => setName(event.target.value)}
                    /> 
                    <input  
                        type= "text"
                        placeholder = "Room"
                        onChange = {(event) => setRoom(event.target.value)}
                    />
                    <Button id ="join" type = "submit" onClick = {joinTeam}> JOIN ROOM </Button> 
                    <Button  type = "submit" onClick = {createTeam} > CREATE ROOM </Button> 
                </Col>
            </Row>
           
        </Container>
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({
        name: state.login.name,
        room: state.login.room
    })

}




const mapDispatchToProps = {setName, setRoom} 


export default connect(mapStateToProps, mapDispatchToProps)(Login);