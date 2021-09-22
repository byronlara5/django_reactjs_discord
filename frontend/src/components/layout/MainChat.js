import React, {useState, useEffect} from 'react'
import { getChatData, sendMessage, getMoreChatData, DeleteMessage } from '../services/chat';

function MainChat(props) {

    const [body, setBody] = useState();
    const [chatFile, setChatFile] = useState();
    const [dataLoaded, setdataLoaded] = useState(false);
    const userData = JSON.parse(localStorage.getItem("user"));

    //State for the chat load more button
    const [hasNext, setHasNext] = useState();

    //This is to retrieve the filename to the input
    const fileNameChatFile = document.querySelector('#chat-file .file-name');

    useEffect(() => {
     const token = localStorage.getItem("token"); 
     setHasNext(null);

     if (props.TextChannel !== null){
        getChatData(props.TextChannel.id, token)
        .then(response => {
            props.setchatData(response.results);
            setdataLoaded(true);
            if (response.next !== null){
                setHasNext(response.next);
            }
        })
     }

    },[props.TextChannel]);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(body, chatFile, props.TextChannel.id)
        .then(response => {
            props.setchatData([response, ...props.chatData])
        })
        document.getElementById('text_area_c').value = '';
        fileNameChatFile.textContent = '';
    };

    const handleLoadMore = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        getMoreChatData(hasNext, token)
        .then(response => {
            //Inverted so the messages can apppear on the top right after the load more button
            props.setchatData([...props.chatData, ...response.results]);
            if(response.next !== null){
                setHasNext(response.next);
            } else {
                setHasNext(null);
                document.getElementById('loadmorebtn').style.display='none';
            }
        })
    };

    const handleDeleteMsg = (e) => {
        e.preventDefault();
        DeleteMessage(e.target.id, props.server)
        .then(response =>{
            document.getElementById(e.target.id).parentNode.parentNode.style.display='none';
        })
    };

if (dataLoaded === true) {

return (
    <div>

        <section className="hero is-link">
            <div className="hero-body">
                <p className="title">{props.TextChannel !== null ? props.TextChannel.title : ''}</p>
                <p className="subtitle">{props.TextChannel !== null ? props.TextChannel.topic : ''}</p>
            </div>
        </section>

        <div className="level-item">
            <button id="loadmorebtn" onClick={handleLoadMore} style={{display: hasNext ? "flex" : "none"}} className="button is-success">Load more</button>
        </div>

        <ol style={{listStyle: "none", display:"flex", flexDirection:"column-reverse"}} className="collection">
        {props.chatData.map(chat =>(
        <li key={chat.id} className="pt-3">
            <article className="media">
            <figure className="media-left">
                <p className="image is-64x64">
                    <img className="is-rounded" src={chat.user.profile.picture}/>
                </p>
            </figure>
            <div className="media-content">
                <div className="content">
                <p><strong>{chat.user.username}</strong><small>{chat.date}</small></p>
                <p>{chat.body}</p>
                <img src={chat.file} />
                </div>
            </div>
            {props.isAdmin ? 
            <div className="media-right">
                <button id={chat.id} onClick={handleDeleteMsg} className="delete"></button>
            </div> : <div></div> }
            </article>
        </li>
        ))}
        </ol>

        <article className="media">
        <figure className="media-left">
            <p className="image is-64x64">
            <img className="is-rounded" src={userData.picture} />
            </p>
        </figure>
        <div className="media-content">
            <form onSubmit={handleSubmit}>
            <div className="field">
            <p className="control">
                <textarea id="text_area_c" className="textarea" name="body" placeholder="Add a comment..." onChange={e => setBody(e.target.value)}></textarea>
            </p>
            </div>
            <nav className="level">
            <div className="level-left">
                <div className="level-item">
                    <button type="submit" className="button is-info">Submit</button>
                </div>
            </div>
            <div className="level-right">
                <div className="level-item">
                    <div id="chat-file" className="file is-right is-info">
                    <label className="file-label">
                        <input id="chatf" className="file-input" type="file" name="chatf" onChange={e => {
                            setChatFile(e.target.files[0])
                            //this is to set the filename to the file button/input
                            let fileInput = document.getElementById('chatf');
                            if (fileInput.files.length > 0 ){
                                fileNameChatFile.textContent = fileInput.files[0].name;
                            }
                        }} />
                        <span className="file-cta">
                        <span className="file-icon">
                            <i className="material-icons">file_upload</i>
                        </span>
                        <span className="file-label">
                            Add a file…
                        </span>
                        </span>
                        <span className="file-name"></span>
                    </label>
                    </div>
                </div>
            </div>
            </nav>
            </form>
        </div>
        </article>
  
    </div>
) 

} else {
  return (
       <div className="container is-max-desktop content is-large has-text-centered">
           <div className="notification is-primary">
               <i className="material-icons">refresh</i>
               <h5 className="title is-5">Nothing to show, click on one of the channels.</h5>
          </div>
       </div>
   )
  }
}

export default MainChat
