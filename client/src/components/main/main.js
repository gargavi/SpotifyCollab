import React, {useEffect, useState } from 'react'; 
import {
    BrowserRouter as Router,  
    Switch,
    Route,
    NavLink,
    useRouteMatch,
    useParams, 
    useHistory
  } from "react-router-dom";
import {connect} from 'react-redux'; 
import SpotifyWebApi from 'spotify-web-api-node';
import {Col, Container, Row, Navbar} from 'react-bootstrap'; 
import "./main.css"; 
import {setAccess} from "../login/loginSlice";
import Playlists from "../playlists/playlists";
import socket from "../socket"; 
import Analysis from "../analysis/analysis";


function Main({name, room, users, setAccess}) { 
    let my_spotify; 
    var all_spotifies = []
    const history = useHistory(); 

    
    useEffect(() => {
        var user;
        console.log(users);
        for (user of users) {
            console.log(user);
            if (user.name == name) { 
                setAccess(user.access_token); 
                my_spotify = new SpotifyWebApi({accessToken: user.access_token})
            } else { 
                all_spotifies.push(new SpotifyWebApi({accessToken: user.access_token}))
            }
        };
        if (!my_spotify) { 
            alert("Not logged in/Error - going back to home page") 
            history.push("/");
        } 

    }, [])
    
    
    const roomUsers = users.map( (person, index) => {

        var adminType = person.admin ? "person admin": "person"
        if (person.name == name) { 
            adminType = "person me"; 
        }
        const image = person.image ? <img src = {person.image} /> : <div className = "placeimage"> { person.name[0] }</div>
        return (
        <div className = {adminType} key = {index} > 
            {image} 
        </div> )
    })

    return ( 
        <Router>
            <div className = "main">
                <Container fluid>
                    <Row>
                        <Col md={2} className = "people">
                            {roomUsers}
                        </Col>
                        <Col md = {10} className = "navigation">                            
                            <Navbar>
                                <NavLink to = "/playlists"  className = "navlink" activeClassName = "mainactive">
                                    Playlists
                                </NavLink>
                                <NavLink to = "/analysis" className = "navlink" activeClassName = "mainactive">
                                    Analysis
                                </NavLink>
                                <NavLink to = "/queue" className = "navlink" activeClassName = "mainactive">
                                    Queue
                                </NavLink>
                            </Navbar>
                            <Switch>
                                <Route exact path = "/playlists">
                                    <Playlists/>
                                </Route>
                                <Route path = "/analysis">
                                    <Analysis/>
                                </Route>
                                <Route path = "/queue">
                                    <h3> Queue Feature Coming Soon </h3> 
                                </Route>
                                <Route path = "/">
                                    <div class = "introduction">
                                        <Row>
                                            <Col md = {12} sm = {12}>
                                                <h1> Welcome {name} to {room} </h1> 
                                                <p>
                                                    Navigate using the tabs above. If you have any 
                                                    suggestions or ideas, feel free to reach out to me using any of the forms of 
                                                    communication listed on my 
                                                    <a href = "https://avigarg.me"> website </a>. This project wouldn't have been possible without the 
                                                    help of the following individuals: 
                                                </p>
                                                <ul>
                                                    <li> Nehal Garg </li>
                                                    <li> Anirudh Patkar </li>
                                                    <li> Maansa Kavuri </li>
                                                    <li> Tanya Kapur </li>  
                                                </ul>

                                            </Col>

                                        </Row>


                                        

                                    </div>

                                </Route>
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </div>
            </Router>
    )
}

const mapStateToProps = state => ({
    name: state.login.name, 
    room: state.login.room, 
    users: state.login.users
})

const mapDispatchToProps = {setAccess}; 

export default connect(mapStateToProps, mapDispatchToProps)(Main); 