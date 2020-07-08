import React, {useEffect, useState} from 'react';
import {useParams, useLocation, useHistory} from "react-router-dom"; 
import queryString from 'query-string'; 
import io from "socket.io-client"; 
import {connect} from "react-redux"; 
import SpotifyWebApi from 'spotify-web-api-node';
import credentials from "../credentials";
import {setName, setRoom, setCode, makeAdmin}  from "../login/loginSlice";
import {Row, Container, Button } from "react-bootstrap"; 
import "./home.css";




let socket; 

function Home ({name, room, admin, makeAdmin, setName, setRoom, setCode}) {
    const [people, setPeople] = useState([]);
    const {code, state} = queryString.parse(useLocation().search); 
    var SpotifyAPI = new SpotifyWebApi(credentials); 
    // SpotifyAPI.authorizationCodeGrant(code).then(
    //     function(data) { 
    //         SpotifyAPI.setAccessToken(data.body["access_toke"])
    //         SpotifyAPI.setRefreshToken(data.body["refresh_token"]); 
    //         console.log(data);
    //     }
    // )
    const history = useHistory(); 
    useEffect (() => { 
        setCode(code);
        const name_temp = state.toString().slice(8, ); 
        const room_temp = state.toString().slice(1, 8); 
        const admin_temp = (state.toString().slice(0, 1) == "1") ?  true : false
        setRoom(room_temp); 
        setName(name_temp); 
        makeAdmin(admin_temp);
        console.log("Effect is running again")
        socket = io("localhost:5000"); 
        socket.emit( 'authenticate', {name_temp, room_temp, admin_temp, code}, (errors, access_token, refresh_token) => {
            if (errors) { 
                history.push("/"); 
                alert(errors); 
            } else {
                SpotifyAPI.setAccessToken(access_token);
                SpotifyAPI.getMe().then(
                    function(data) {
                        const id = data.body["id"];
                        socket.emit( 'join', {name_temp, room_temp, id})
                    });
            }
        })

    }, [])

    async function getPerson(users) { 
        var people_array = [] 
        var user;
        for (user of users) {
            await SpotifyAPI.getUser(user.id).then(
                function(data) { 
                    var person = {} 
                    person.name = user.name; 
                    person.admin = user.admin;
                    if (data.body["images"][0]) { 
                        person.image = data.body["images"][0]["url"]; 
                    }
                    setPeople([...people_array, person])
                    people_array.push(person);
                }
            )
        }

    }


    useEffect (() => { 

        socket.on('roomData', ({users}) => {
            getPerson(users);
        } ) 
        socket.on('start', () => { 
            history.push("/main"); 
        })
    }, [])


    const users = people.map( (person, index) => {
        console.log(index); 
        console.log(person);
        const adminType = person.admin ? "person admin": "person"
        const nameType = (person.name == name) ? "profile": "normal"
        return (
        <div className = {adminType} key = {index} > 
            <img src={person.image} /> 
            <i className = {nameType}> {person.name} </i>
        </div> )
    })

    let startbutton; 
    if (admin) { 
        startbutton = <Button className = "startbutton" onClick = {() => socket.emit('start', {room})}> Click to Start </Button>
    } else { 
        startbutton = <h3> Waiting for Admin to Start... </h3> 
    }

    return (
        <div className = "home">
            <Container>
                <Row className = "code">  
                    <label htmlFor="roomCode" > CODE: </label> <i id = "roomCode"> {room}</i>
                    {startbutton} 
                </Row> 
                <Row>
                    {users}
                </Row>
            </Container>
        </div>
    )

}

const mapStateToProps = state => { 
    return ({
        name: state.login.name, 
        room: state.login.room, 
        code: state.login.code, 
        admin: state.login.admin
    })
}

const mapDispatchToProps = {setName, setRoom, setCode, makeAdmin}; 



export default connect(mapStateToProps, mapDispatchToProps)(Home); 