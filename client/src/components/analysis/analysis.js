import React, {useEffect, useState} from "react"; 
import {connect} from "react-redux"; 
import SpotifyWebApi from "spotify-web-api-node"; 
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap"; 
import "./analysis.css"; 

function Analysis({access_token, users, name}) {
    let my_spotify;
    var all_spotifies = []
    const [range, setRange] = useState("long_term"); 
    const [compare, setCompare] = useState("");  
    const [topValues, setMyValues] = useState([])
    const [type, setType] = useState("artists"); 
    const [otherValues, setOtherValues] = useState([]); 


    async function GetTopArtists() { 
        await my_spotify.getMyTopArtists({limit: 50, time_range: range}).then(
            function(data) { 
                setMyValues(data.body.items.map( value => { 
                    return ({
                        name: value.name, 
                        image: value.images[0]
                    })
                }))
            }
        )
        const user = users.find(user => user.name == compare);
        console.log(compare);
        if (user) {
            console.log(user.access_token); 
            const other_spotify = new SpotifyWebApi({accessToken: user.access_token}); 
            other_spotify.getMyTopArtists({limit: 50, time_range: range }).then(
                function(data) { 
                    setOtherValues(data.body.items.map( value => { 
                        return ({
                            name: value.name, 
                            image: value.images[0]
                        })
                    }))
                }
            )
        }
    }

    async function GetTopTracks() { 
        await my_spotify.getMyTopTracks({limit: 50, time_range: range}).then(
            function(data) { 
                setMyValues(data.body.items.map( value => { 
                    const album = value.album.images
                    const artists = value.artists
                    return ({
                        name: value.name,
                        image: album ? album[0] : {url: ""}, 
                        artists: artists ? artists[0].name: null })
                }))  
            }
        )
        const user = users.find(user => user.name == compare);
        if (user) {
            const other_spotify = new SpotifyWebApi({accessToken: user.access_token}); 
            other_spotify.getMyTopTracks({limit: 50, time_range: range }).then(
                function(data) { 
                    setOtherValues(data.body.items.map( value => { 
                        const album = value.album.images
                        const artists = value.artists
                        return ({
                            name: value.name,
                            image: album ? album[0] : {url: ""}, 
                            artists: artists ? artists[0].name: null })
                    }))  
                }
            )
        }
    }



    useEffect(()=> {
        my_spotify = new SpotifyWebApi({accessToken: access_token});
        if (type === "artists") { 
            GetTopArtists(); 
        } else {
            GetTopTracks()
        }
    
    }, [range, type, compare])

    let comparepeople;
    if (users.length > 1) { 
        const peopleoptions = users.map(user => { 
            if (user.name != name) { 
                return(
                    <option value = {user.name}> {user.name} </option>
                )
            }})
        comparepeople =
            <div> 
            <label> Compare: </label> 
            <select onChange = {(event) => setCompare(event.target.value)}>
                <option value = ""> </option>
                {peopleoptions}
            </select> 
            </div>
    } else { 
        comparepeople = <h4> No other users to compare </h4> 
    }

    const mytops = topValues.map( value => {
        let match; 
        if (otherValues.find(other => other.name == value.name)) { 
            match = "matched"
        } else { 
            match = "notmatch"
        }
        if (type == "artists") {
            return ( 
                <tr className = "artist"> 
                    <td className = "image">
                        <img src = {value.image["url"]} />
                    </td>
                    <td className = "description">
                        <i className = {match}> {value.name} </i>
                    </td>
                </tr>
            )
        } else { 
            return (
                <tr className = "track"> 
                    <td className = "image">
                        <img src = {value.image["url"]} />
                    </td>
                    <td className = "description">   
                        <i className = {match}> {value.name} </i>
                        <i className = {match}> {value.artists} </i>
                    </td>
                </tr>
                )
        }
    })
    const othertops = otherValues.map( value => { 
        let match; 
        if (topValues.find(other => other.name == value.name)) { 
            match = "matched"
        } else { 
            match = "notmatch"
        }
        if (type == "artists") { 
            return ( 
                <tr className = "artist"> 
                    <td className = "image">
                        <img src = {value.image["url"]} />
                    </td>
                    <td className = "description">
                        <i className = {match}> {value.name} </i>
                    </td>
                </tr>
            )
        } else { 
            return (
                <tr className = "track"> 
                    <td className = "image">
                        <img src = {value.image["url"]} />
                    </td>
                    <td className = "description">   
                        <i className = {match}> {value.name} </i>
                        <i className = {match}> {value.artists} </i>
                    </td>
                </tr>
                )
        }
    })

    return (
        <div class = "analysis">
            <Container>
                <Row>
                    <Col md = {12} sm = {12} >
                        <Row>
                            <Col md= {4} sm = {12}> 
                            <select onChange = {(event) => setType(event.target.value)}>
                                <option value = "artists"> Artists </option>
                                <option value  = "tracks"> Tracks </option>
                            </select>
                            </Col>
                            <Col md= {4} sm = {12}>
                            <select onChange = {(event) => setRange(event.target.value)}>
                                <option value = "long_term"> Long Term </option>
                                <option value = "medium_term"> Medium Term </option>
                                <option value = "short_term"> Short Term </option>
                            </select>
                            </Col>
                            <Col md = {4} sm = {12}>
                                {comparepeople}
                            </Col>
                        </Row>
                        <Row>
                            <Col md = {6} sm = {12}>
                                <div className ="totaldisplay"> 
                                    <table>
                                    <tbody>
                                        {mytops}
                                    </tbody>
                                    </table>
                                </div>
                            </Col>
                            <Col md = {6} sm = {12}>
                                <div className = "totaldisplay"> 
                                    <table>
                                    <tbody>
                                        {othertops}
                                    </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

const mapStateToProps = state => ({ 
    name: state.login.name,
    access_token: state.login.access_token, 
    users: state.login.users
})

export default connect(mapStateToProps, null)(Analysis);  
