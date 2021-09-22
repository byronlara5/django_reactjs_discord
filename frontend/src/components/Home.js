import React, { useContext, useState, useEffect} from 'react'

import Header from './layout/Header';
import Footer from './layout/Footer';
import ServersNav from './layout/ServersNav';
import Server from './layout/Server';

import { getSideNavServers } from './services/Servers';

function Home() {

    const [sidenavServers, setsidenavServers] = useState([]);
    const [ActiveServer, setActiveServer] = useState();
    const [TextChannel, setTextChannel] = useState();
    const [chatData, setchatData] = useState();

    useEffect(()=> {
        //check for the local token
        const token = localStorage.getItem("token");
        getSideNavServers(token)
        .then(response =>{
            setsidenavServers(response);
        })
    }, [])

    return (
        <div>
            <Header />
            <div className="columns">
                <div className="column is-1">
                    <ServersNav servers={sidenavServers} setActiveServer={setActiveServer} setTextChannel={setTextChannel} setchatData={setchatData}/>
                </div>
                <div className="column is-11">
                    <Server servers={sidenavServers} ActiveServer={ActiveServer} TextChannel={TextChannel} setTextChannel={setTextChannel} chatData={chatData} setchatData={setchatData} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home
