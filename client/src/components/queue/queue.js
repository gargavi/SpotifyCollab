import React, {useEffect} from 'react'; 
import {connect} from 'react-redux'; 
import "./queue.css"; 
import {Table} from "react-bootstrap"; 
import socket from "../socket"; 


function Queue({name, queue}) { 

    const thelist = queue.map(song => <tr> <td className = "queueimage"> <img src = {song.img} /></td> <td className = "queueDescrip"> <p> {song.name} </p> <i> {song.artist} </i> </td>  </tr>)

    return (
        <div className = "queue"> 
            <Table>
                <tbody>
                    {thelist}
                </tbody>
            </Table>
        </div>
 
        
    )

}

const mapStateToProps= (state) => {   
    return (
        {name: state.login.name, 
    queue: state.queue.queue })

}

export default connect(mapStateToProps, null) (Queue); 
