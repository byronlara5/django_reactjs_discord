import React, {useState, useEffect } from 'react'
import MainChat from './MainChat';
import Members from './Members';

import { getServerData, CreateNewCategory, CreateNewChannel, LeaveServer } from '../services/Servers';
import { SendNewInvitation } from '../services/notifications';

function Server(props) {

    const [serverDetail, setServerDetail] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    //State for the modals
    const [titleNewCtg, settitleNewCtg] = useState();
    
    const [titleNewCh, settitleNewCh] = useState();
    const [topicNewCh, settopicNewCh] = useState();
    const [ctgForNewChannel, setctgForNewChannel] = useState();

    const [username, setUsername] = useState();



    useEffect(()=> {
        //Check for token
        const token = localStorage.getItem("token");
        if(typeof props.ActiveServer !== 'undefined'){
            getServerData(props.ActiveServer, token)
            .then(response =>{
                setServerDetail(response.data);
                if (response.is_admin === true){
                    setIsAdmin(true);
                }
                setDataLoaded(true);
            })
        }

    }, [props.ActiveServer])


    /** Functions for the modals */

    function ModalTrigger(parameter, category_id){
        var modal = document.getElementById(parameter);
        setctgForNewChannel(category_id);
        modal.style.display = 'block';
    }

    function ModalClose(parameter){
        var modal = document.getElementById(parameter);
        setctgForNewChannel('');
        modal.style.display = 'none';
    }

    /** END Functions for the modals */

    const handleSubmitCategory = (e) => {
        e.preventDefault();
        CreateNewCategory(serverDetail.id, titleNewCtg)
        .then(response =>{
            serverDetail.categories.push(response);
            ModalClose("add-category-modal");
        })
    };

    const handleSubmitChannel = (e) => {
        e.preventDefault();
        CreateNewChannel(serverDetail.id, ctgForNewChannel, titleNewCh, topicNewCh)
        .then(response => {
            serverDetail.categories.filter(obj=>obj.id === ctgForNewChannel)[0]['text_channels'].push(response);
            ModalClose("add-channel-modal");
        })
    };

    const handleSubmitInvitation = (e) => {
        e.preventDefault();
        //Check for token
        const token = localStorage.getItem("token");
        SendNewInvitation(username, serverDetail.id, token)
        .then(response => {
            console.log(response);
            ModalClose("invite-user-modal");
        })
    };

    function handleClick(parameter, event){
        props.setTextChannel(parameter);
    };

    const handleLeaveServer = (e) => {
        e.preventDefault();
        LeaveServer(serverDetail.id)
        .then(response =>{
            location.reload();
        })
    };

    if (dataLoaded === true){
    return(
        <main>

        {/* Modal for Group/Categories Channel Creation*/}  
            <div className="modal" id="add-category-modal">
            <div className="modal-background"></div>
            <div className="modal-card">
                <form onSubmit={handleSubmitCategory}>
                <header className="modal-card-head">
                <p className="modal-card-title">Create new category or group</p>
                <a onClick={ModalClose.bind(this, "add-category-modal")} className="delete" aria-label="close"></a>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input id="title" type="text" maxLength="25" className="input" name="titleCategory" onChange={e => settitleNewCtg(e.target.value)} />
                    </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                <button type="submit" className="button is-success">Save changes</button>
                <a onClick={ModalClose.bind(this, "add-category-modal")} className="button">Cancel</a>
                </footer>
                </form>
            </div>
            </div>
        {/* End modal */}

        {/* Modal for User invitation */}  
        <div className="modal" id="invite-user-modal">
            <div className="modal-background"></div>
            <div className="modal-card">
                <form onSubmit={handleSubmitInvitation}>
                <header className="modal-card-head">
                <p className="modal-card-title">Invite an user</p>
                <a onClick={ModalClose.bind(this, "invite-user-modal")} className="delete" aria-label="close"></a>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input id="userinviteipt" type="text" className="input" name="usernameinvi" onChange={e => setUsername(e.target.value)} />
                    </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                <button type="submit" className="button is-success">Save changes</button>
                <a onClick={ModalClose.bind(this, "invite-user-modal")} className="button">Cancel</a>
                </footer>
                </form>
            </div>
            </div>
        {/* End modal */}

        {/* Modal for Group/Categories Channel Creation*/}  
            <div className="modal" id="add-channel-modal">
            <div className="modal-background"></div>
            <div className="modal-card">
                <form onSubmit={handleSubmitChannel}>
                <header className="modal-card-head">
                <p className="modal-card-title">Create new text channel</p>
                <button onClick={ModalClose.bind(this, "add-channel-modal")} className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body">

                    <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input id="titleChannel" type="text" maxLength="25" className="input" name="titleChannel" onChange={e => settitleNewCh(e.target.value)}/>
                    </div>
                    </div>

                    <div className="field">
                    <label className="label">Topic</label>
                    <div className="control">
                        <input id="topic" type="text" maxLength="50" className="input" name="topic" onChange={e => settopicNewCh(e.target.value)}/>
                    </div>
                    </div>


                </section>
                <footer className="modal-card-foot">
                <button type="submit" className="button is-success">Save changes</button>
                <a onClick={ModalClose.bind(this, "add-channel-modal")} className="button">Cancel</a>
                </footer>
                </form>
            </div>
            </div>
        {/* End modal */}   

            <div className="columns pt-1">
                <div className="column is-2">
                    <div className="card">
                        <div className="card-image">
                        <figure class="image">
                            <img src={serverDetail.banner} alt="Placeholder image" />
                        </figure>
                        </div>
                        <div className="card-content">
                            <p class="title is-4">{serverDetail.title}</p>
                            <p class="subtitle is-6">{serverDetail.description}</p>
                        </div>
                        <footer class="card-footer">
                            <a onClick={ModalTrigger.bind(this, "invite-user-modal")} class="card-footer-item">Invite People</a>
                            <a onClick={handleLeaveServer} class="card-footer-item">Leave server</a>
                        </footer>
                    </div>

                    <br></br>

                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                <button onClick={ModalTrigger.bind(this, "add-category-modal")} className="button is-small is-primary is-rounded">
                                    <span className="icon is-small">
                                        <i className="material-icons">add</i>
                                    </span>
                                    <span>Category</span>
                                </button>
                            
                            {serverDetail.categories.map(category =>(
                                <aside class="menu">
                                    <p key={category.id} class="menu-label">{category.title}</p>

                                    <button onClick={ModalTrigger.bind(this, "add-channel-modal", category.id)} className="button is-small is-primary is-rounded">
                                        <span className="icon is-small">
                                            <i className="material-icons">add</i>
                                        </span>
                                        <span>Channel</span>
                                    </button>

                                    <ul class="menu-list">
                                        {category.text_channels.map(text_channel =>(
                                            <li key={text_channel.id}><a onClick={handleClick.bind(this, text_channel)}>{text_channel.title}</a></li>
                                        ))}
                                    </ul>
                                </aside>
                            ))}

                            </div>
                        </div>
                    </div>

                </div>
                
                <div className="column is-7">
                    <MainChat TextChannel={props.TextChannel} chatData={props.chatData} setchatData={props.setchatData} isAdmin={isAdmin} server={serverDetail.id}/>
                </div>

                <div className="column is-2">
                    <Members members={serverDetail.members} isAdmin={isAdmin} server={serverDetail.id} />                  
                </div>
            </div>
        </main>
    )
    } else {
    return (
        <div className="container is-max-desktop content is-large has-text-centered">
            <div className="notification is-primary">
                <i className="material-icons">refresh</i>
                <h5 className="title is-5">Nothing to show, click on one of the servers.</h5>
            </div>
        </div>
    )
    }
}

export default Server
