import io from "socket.io-client"; 
let socket; 
//export const endpoint = "https://spotifybackend.azurewebsites.net/";
export const endpoint = "http://localhost:5000"
socket = io(endpoint); 


export default socket; 