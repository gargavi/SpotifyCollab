import React, {useState, useEffect} from 'react'; 
import {connect} from "react-redux";
import {Link, useHistory} from "react-router-dom"; 
import {Button, Col, Row, Container} from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node'; 
import SpotifyLogo from "../photos/Spotify_Logo_RGB_Green.png"
import credentials from "../credentials";
import {setName, setRoom} from "./loginSlice"; 
import "./login.css"

function Login({name, room, setName, setRoom}) { 
    const [errors, setErrors] = useState(""); 
    const history = useHistory();

    function Authorize(name, room, admin) { 
        
        var spotifyApi = new SpotifyWebApi(credentials);
        var scopes = ['user-read-private', 
        'playlist-read-private', 'user-library-read', 'user-modify-playback-state' ]
        const adminbit =  admin ? 1 : 0   
        const state = adminbit +  room + name
        var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state, true); 
        window.open(authorizeURL, "_self")
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
        <Container>
            
           <img src = {SpotifyLogo} />
           <Row> 
                <label className = "namelabel"> NAME: </label>
                <input  
                    type= "text"
                    placeholder = "Name"
                    onChange = {(event) => setName(event.target.value)}
                /> 
            </Row>
            <Row>
                <Button type = "submit" onClick = {joinTeam}> JOIN ROOM </Button> 
                <input  
                    type= "text"
                    placeholder = "Room"
                    onChange = {(event) => setRoom(event.target.value)}
                />
            </Row>
            <Row>
                <Button type = "submit" onClick = {createTeam} > CREATE ROOM </Button> 
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