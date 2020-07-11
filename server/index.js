const http = require('http'); 
const express = require('express'); 
const socketio = require("socket.io"); 
const cors = require('cors'); 
const SpotifyWebApi =  require('spotify-web-api-node'); 
const router =  express.Router(); 

router.get("/", (req, res) => { 
    res.send({response: "Server is up and running"}).status(200); 
})

const PORT = process.env.PORT || 5000;

const app  = express(); 
const server = http.createServer(app); 
const io = socketio(server);

app.use(cors()); 
app.use(router); 

users = [] 

const credentials = { 
    clientId: "83761c12bfb5467faa0a62979a6fc4e2", 
    clientSecret: "92bb30f93a15410e980716ce82cd600b", 
    //redirectUri: "http://localhost:3000/home"
    redirectUri: "https://spotifyrooms.z22.web.core.windows.net/home"
};

var SpotifyApi  = new SpotifyWebApi(credentials);

io.on('connect', (socket) => { 
    socket.on('authenticate', ({name_temp, room_temp, admin_temp, code}, callback) => { 
        let errors; 
        let access_token;
        let refresh_token;
        name = name_temp.trim().toLowerCase(); 
        if ((!admin_temp && users.find((user) => user.room == room_temp)) || admin_temp ) {
            if (users.find(user => user.room == room_temp && user.name == name_temp)) {
                callback("That username already exists", null, null)
            } else { 
                socket.join(room_temp)
                console.log("Joined room")
                SpotifyApi.authorizationCodeGrant(code).then(
                    function(data) { 
                        access_token = data.body['access_token'];
                        refresh_token = data.body["refresh_token"];
                        SpotifyApi.setAccessToken(access_token);
                        SpotifyApi.getMe().then(
                            function(data) {
                                const id = data.body["id"];
                                const image = data.body["images"][0]
                                const user = {
                                    name: name_temp, 
                                    room: room_temp, 
                                    admin: admin_temp, 
                                    id: id, 
                                    socket_id: socket.id, 
                                    access_token: access_token,
                                    refresh_token: refresh_token, 
                                    image: image ? image["url"] : null
                                }
                                users.push(user)
                                callback(null)
                        });
                    }, 
                    function(err) { 
                        errors = "Authentication failed";
                        callback(errors)
                    }
                )
            }
        } else { 
            errors = "That room doesn't exist already"
            callback(errors)
        } 
        console.log("authenticate");
    }),
    socket.on('join', () => {
        const relevantUser = users.find(user => user.socket_id == socket.id); 
        const roomUsers = users.filter(user => user.room == relevantUser.room); 
        console.log(users);
        io.to(relevantUser.room).emit('roomData', {users: roomUsers}); 
    } ), 
    socket.on('start', ({room}) => {
        console.log(room);
        io.to(room).emit('start');
    }), 
    socket.on('disconnect', () => {
        const index = users.findIndex(user => user.socket_id === socket.id); 
        let current_user; 
        if (index != -1 ) {
            current_user = users.splice(index, 1)[0]
        }
        if (current_user) {
            if (current_user.admin) { 
                var new_admin = users.find(user => user.room == current_user.room); 
                if (new_admin) { 
                    new_admin.admin = true; 
                }
            }
            const roomUsers = users.filter(user => user.room == current_user.room); 
            io.to(current_user.room).emit('roomData', {users: roomUsers})
        }
    }) 
})


server.listen(PORT, () => console.log("cool"))