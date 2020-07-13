import React, {useEffect, useState} from "react"; 
import {connect} from "react-redux"; 
import SpotifyWebApi from "spotify-web-api-node"; 
import {useParams, Link} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap"; 
import "./playlist.css"; 

function Playlist({access_token, users, name}) {
    let my_spotify;
    var all_spotifies = []
    let { playlistid } = useParams();
    const [songs, setSongs] = useState([]);
    const [details, setDetails] = useState(""); 
    const [loaded, setLoaded] = useState(false); 

    async function addSongs(id, offset, all_songs) {
        await my_spotify.getPlaylistTracks(id, {limit: 50, offset: offset, fields: "items(track(album(images), artists(name),id, name))"}).then(
            function(data) {
                var item;
                const pack_songs = []
                for (item of data.body["items"]) {
                    const track = item["track"]

                    if (track) {
                        const album = track["album"]["images"][0]
                        const artist = track["artists"][0]
                        var song = {
                            image: album ? album["url"] : null , 
                            artist: artist ? artist["name"] : null, 
                            id: track["id"],
                            name: track["name"] ,
                            matched: 1, 
                            users: []
                        }
                        pack_songs.push(song);
                    }
                }
                checkSongs(pack_songs); 
                all_songs.push( ...pack_songs);
                if (data.body["next"]) { 
                        addSongs(id, offset + 50, all_songs);
                }  else { 
                     setSongs(all_songs);
                }
       })
    }

    async function checkSongs(pack_songs) {
        const ids = pack_songs.map(song => song.id); 
        var spot;
        var j = 0; 
        for (spot of all_spotifies) {
            await spot.containsMySavedTracks(ids).then(
                function(data) {
                    for (var i = 0; i < data.body.length; i++) { 
                        if (data.body[i]) { 
                            pack_songs[i].matched += 1;
                            pack_songs[i].users.push(users[j].name)
                        }
                    } 
                    if (j == (all_spotifies.length - 1)) {
                        console.log("loaded")
                        setLoaded(true); 
                    } else { 
                        console.log("loading")
                    }
                }, 
                function(data) {
                    console.log(ids); 
                }
            )
            j ++;
        }
        
    }

    useEffect(()=> {
        var user;
        for (user of users) {
            if (user.name != name) { 
                all_spotifies.push(new SpotifyWebApi({accessToken: user.access_token}))
            }
        };
        my_spotify = new SpotifyWebApi({accessToken: access_token});
        my_spotify.getPlaylist(playlistid, {fields: "description, images, name, type, followers"}).then(
            function(data) { 
                setDetails(data.body); 
            }
        )
        var all_songs = new Array(); 
        addSongs(playlistid, 0, all_songs);
        

    }, [])


    const songlist = songs.map( (song, index) => { 
        var numb = 360 - (360 * (song.matched/(users.length)))
        let cover; 
        if (numb > 180) { 
            cover = <div className = "cover" style = {{ transform: `rotate(${numb-180}deg)`}}> </div>
        } else { 
            cover = <div className = "cover" style = {{backgroundColor: "#1ED760", transform: `rotate(${numb}deg)`}}></div>
        }

        const matched_users = song.users.map(user => { 
            
            return (
                <i> {user} </i>
            )
        })
        return(
            <tr className = "song" key= {index} >
                <td className = "songImage">
                    <img src = {song.image} />
                </td>
                <td className = "songName">
                    <h4>{song.name} </h4>
                    <i>{song.artist} </i>
                </td>
                <td className = "songMatching">
                    <div className = "largePie">
                    <div class = "pie">
                    {cover}
                    </div>
                    </div>
                </td>
                <td className = "userMatching">
                    {matched_users}
                </td>
            </tr>
        )
    })
    let descrip; 
    if (details) { 
        descrip = <div className = "playlistDescription">
                    <img src = {details["images"][0] ? details["images"][0]["url"] : null} />
                    <h5> {details["name"]} </h5>
                    <p> {details["followers"]["total"]} followers </p>
                    <p> {details["description"]} </p>
                </div>
    } else { 
        descrip = <h1> Loading </h1>
    }

    return (
        <div class = "singlePlaylist">
            <Container>
                <Row>
                    <Col md = {4} sm = {12} >
                        <Link to = "/playlists" className = "goback"> PLAYLIST HOME </Link>
                        {descrip}
                    </Col>
                    <Col md = {8} sm = {12} >
                        <div className = "playlistSongs">
                            <table>
                                <tbody>
                                    {songlist}
                                </tbody>
                            </table>
                        </div>
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

export default connect(mapStateToProps, null)(Playlist);  
