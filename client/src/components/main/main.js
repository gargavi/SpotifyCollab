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
import Queue from "../queue/queue";
import socket from "../socket"; 
import Analysis from "../analysis/analysis";
import {  faStepForward, faStepBackward, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {setSongName, setSongImage, goNextQueue, addSong} from "../queue/queueSlice";

function Main({name, room, admin, access_token, users, setAccess, songName, songImage, setSongName, setSongImage, goNextQueue, addSong}) { 
    let my_spotify; 
    var all_spotifies = []
    const history = useHistory(); 
    
    useEffect(() => {
        var user;
        for (user of users) {
            if (user.name == name) { 
                setAccess(user.access_token); 
                my_spotify = new SpotifyWebApi({accessToken: user.access_token})
                if (user.admin) {
                    my_spotify.getMyCurrentPlaybackState({}).then(
                        function(data) { 
                            if (data.body) { 
                                if (data.body["item"]["name"]) { 
                                    socket.emit("setSongName", {name: data.body["item"]["name"], room: room, img: data.body["item"]["album"]["images"][0]});
                                };
                            } else { 
                                socket.emit("setSongName", {name: "Nothing Playing", img: {url: ""}, room: room})
                            }
                        }
                    )
                }
            } else { 
                all_spotifies.push(new SpotifyWebApi({accessToken: user.access_token}))
            }
        };
        if (!my_spotify) { 
            alert("Not logged in/Error - going back to home page") 
            history.push("/");
        } 

    }, [])

    function getSongName() { 
        return songName
    }

    useEffect( () => {
        let updateinterval;
        var my_spot = new SpotifyWebApi({accessToken: access_token})
        if (admin) { 
            updateinterval = setInterval(() => UpdateMe(), 2000);
            function UpdateMe() { 
                my_spot.getMyCurrentPlaybackState().then(
                    function(data) { 
                        var currentName = getSongName();
                        if (data.body) { 
                            const song = data.body["item"] ? data.body["item"]["name"] : "Null"
                            const img = data.body["item"]["album"]["images"][0] ? data.body["item"]["album"]["images"][0] : {"url": null}
                            console.log(song); 
                            console.log(currentName); 
                            if (song != currentName) { 
                                socket.emit("goNext", {song: song, room: room, img: img})
                            }
                        }
                    }
                )
            }; 
        } 
        return () => clearInterval(updateinterval);
    }, [songName])

    useEffect( () => { 
        socket.on('goBack', ({song, img}) => { 
            setSongName({song, img}); 
        }); 
        socket.on('pause', () => { 
            console.log('pause')
        });
        socket.on('goNext', ({song, img}) => { 
            goNextQueue({song, img}); 
        }); 
        socket.on('setSongName', ({name, img}) => { 
            setSongName({song: name, img});
        })
        socket.on('setSongImage', ({src})=> { 
            setSongImage(src); 
        })
        socket.on('addSong', ({name, artist, img, id}) => { 
              addSong({name, artist, img}); 
              if (admin) {
                  
                  my_spotify.addQueue("spotify:track:" + id).then(
                      function(data) { 
                      }, function(data) { 
                          alert("error")
                      }
                  )
              }
        })
        socket.on('Next', () => {
            my_spotify.skipToNext().then(
                function(data) {   
                    
                my_spotify.getMyCurrentPlayingTrack({}).then(
                    function(data) { 
                        if (data.body) {
                            const song = data.body["item"] ? data.body["item"]["name"] : "Null"
                            const img = data.body["item"]["album"]["images"][0] ? data.body["item"]["album"]["images"][0] : {"url": null}
                            if (song) { 
                                socket.emit('goNext', {song, img, room}); 
                            }
                        }
                    }
                )}
            )
            
        })
        socket.on('Back', () => { 
            my_spotify.skipToPrevious().then(
                function(data) {
                my_spotify.getMyCurrentPlayingTrack({}).then(
                    function(data) { 
                        if (data.body) { 
                            const song = data.body["item"] ? data.body["item"]["name"] : "Null"
                            const img = data.body["item"]["album"]["images"][0] ? data.body["item"]["album"]["images"][0] : {"url": null}
                            if (song) { 
                                socket.emit('goBack', {song, img, room})
                            };
                        } 
                    }
                )}
            )
            
        })
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
                        <Col md={3} sm={12} >
                            <div className = "people">
                                {roomUsers}                                
                            </div>
                            <div className = "playing">
                                <img src = {songImage} />
                                <p> {songName} </p>

                                <FontAwesomeIcon onClick = {() => socket.emit("Back", {room})} icon={faStepBackward} size = "2x" />
                                <FontAwesomeIcon onClick = {() => socket.emit("pause", {room}) }icon={faPlay} size = "2x" /> 
                                <FontAwesomeIcon onClick = {() => socket.emit("Next", {room})} icon={faStepForward} size = "2x" />
                            </div> 
                        </Col>
                        <Col md = {9} sm={12} className = "navigation">                            
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
                                    <Queue /> 
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
    admin: state.login.admin, 
    users: state.login.users, 
    songName: state.queue.songName,
    songImage: state.queue.songImage, 
    access_token: state.login.access_token
})

const mapDispatchToProps = {setAccess, setSongName, goNextQueue, addSong, setSongImage}; 

export default connect(mapStateToProps, mapDispatchToProps)(Main); 