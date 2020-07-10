import React, {useEffect, useState} from 'react';
import {useParams, useLocation, useHistory} from "react-router-dom"; 
import queryString from 'query-string'; 
import socket from "../socket"; 
import {connect} from "react-redux"; 
import SpotifyWebApi from 'spotify-web-api-node';
import credentials from "../credentials";
import {setName, setRoom, setCode, makeAdmin, setUsers}  from "../login/loginSlice";
import {Row, Col, Container, Button } from "react-bootstrap"; 
import "./home.css";




function Home ({name, room, users, admin, makeAdmin, setName, setRoom, setUsers, setCode}) {
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
        socket.emit( 'authenticate', {name_temp, room_temp, admin_temp, code}, (errors) => {
            if (errors) { 
                history.push("/"); 
                alert(errors); 
            } else { 
                socket.emit('join')
            }
        })
    }, [])

    // async function getPerson(users) {
    //     console.log(users); 
    //     var people_array = [] 
    //     var user;
    //     for (user of users) {
    //         SpotifyAPI.setAccessToken(user.access_token)
    //         await SpotifyAPI.getUser(user.id).then(
    //             function(data) { 
    //                 var person = {} 
    //                 person.name = user.name; 
    //                 person.admin = user.admin;
    //                 if (data.body["images"][0]) { 
    //                     person.image = data.body["images"][0]["url"]; 
    //                 }
    //                 setPeople([...people_array, person])
    //                 people_array.push(person);
    //             }, function(err) { 
    //                 alert(err.toString());
    //             }
    //         )
    //     }

    // }

    useEffect (() => { 
        socket.on('roomData', ({users}) => {
            setUsers(users); 
        } ) 
        socket.on('start', () => { 
            history.push("/main"); 
        }) 
    }, [])

    const roomUsers = users.map( (person, index) => {

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
                    <Col md = {12}>  
                    <label htmlFor="roomCode" > CODE: </label> <i id = "roomCode"> {room}</i>
                    {startbutton} 
                    </Col>
                </Row> 
                <Row>
                    <Col md = {12}>
                        {roomUsers}
                    </Col> 
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
        admin: state.login.admin, 
        users: state.login.users
    })
}

const mapDispatchToProps = {setName, setRoom, setCode, makeAdmin, setUsers}; 



export default connect(mapStateToProps, mapDispatchToProps)(Home); 