import React, {useEffect, useState} from "react"; 
import {connect} from "react-redux"; 
import {
    BrowserRouter as Router,  
    Switch,
    Route,
    NavLink,
    Link,
    useRouteMatch,
    useParams, 
    useHistory
  } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";
import "./playlists.css"
import Playlist from "./playlist";

function Playlists( {name, room, users, access_token}) { 
    const [playlist, setPlaylists] = useState([]); 
    var my_spotify;
    let history = useHistory(); 
    let match = useRouteMatch(); 
    async function addPlaylists(id, offset, all_playlist) {
        await my_spotify.getUserPlaylists(id, {limit: 50, offset: offset}).then(
            function(data) {
                var item;
                for (item of data.body["items"]) {
                    var playlist = {
                        id: item["id"], 
                        images: item["images"], 
                        name: item["name"]
                    }
                    all_playlist.push(playlist);
                }
                if (data.body["next"]) { 
                        addPlaylists(id, offset + 50, all_playlist);
                }  else { 
                     setPlaylists(all_playlist);
                }
       }, function(data) { 
           console.log(data); 
       })
    }
    
    useEffect(() => {
        my_spotify = new SpotifyWebApi({accessToken: access_token})
                my_spotify.getMe().then(
                    function(data) {
                        var all_playlist = new Array()
                        addPlaylists(data.body["id"], 0, all_playlist); 
                    }, 
                    function(data) { 
                        console.log(data); 
                }
        )
        if (!my_spotify) { 
            alert("Not logged in/Error - going back to home page") 
            history.push("/");
        } 
    }, [])


    const playlists = playlist.map( playlist => { 
        const image = (playlist.images.length >= 2) ? playlist.images[playlist.images.length - 2] : playlist.images[playlist.images.length - 1] 
        const src = image ? image["url"] : null
        if (!image) { 
            console.log(playlist);
        }
        return ( 
            <Link to = {`${match.url}/${playlist.id}`}>
                <div className = "playlist" >
                    <img src = {src} />
                    <i> {playlist.name} </i>
                </div>
            </Link>
        )
    })
    return ( 
        <Router>
        <Switch>
            <Route path={`${match.path}/home `}>
                <div className= "allplaylists">
                    {playlists}
                </div>
            </Route>
            <Route exact path={`${match.path}`}>
                <div className= "allplaylists">
                    {playlists}
                </div>
            </Route>
            <Route exact path={`${match.path}/:playlistid`}>
                <Playlist/>
            </Route>


        </Switch>



        </Router>

    )

}


const mapStateToProps= (state) => {   
    return (
        {name: state.login.name, 
    room: state.login.room, 
    users: state.login.users, 
    access_token: state.login.access_token})

}

export default connect(mapStateToProps, null) (Playlists); 
