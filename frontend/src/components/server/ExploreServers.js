import React, { useState, useEffect } from 'react'

import { getServerCategories, getserversInCategory, getServersInSearch } from '../services/Servers';
import { ReqToJoinServer } from '../services/notifications';

function ExploreServers() {
    //To load the categories for the tabs
    const [serverCategory, setServerCategory] = useState([]);
    const [servers, setServers] = useState([]);
    const [searchBody, setSearchBody] = useState();

    const [ActiveCategoryCSS, setActiveCategoryCSS] = useState(null);


    useEffect(()=> {
        //Check for the token
        const token = localStorage.getItem("token");
        //Request to get all the categories
        getServerCategories(token)
        .then(response => {
            setServerCategory(response);
        })
    },[]);

    function handleClick(parameter, event){
        //Check for the token
        const token = localStorage.getItem("token");
        getserversInCategory(token, parameter)
        .then(response =>{
            setServers(response.results);
        })

        if (ActiveCategoryCSS !== null){
            document.getElementById(ActiveCategoryCSS).classList.remove('is-active')
        }

        document.getElementById(parameter).classList.add('is-active');
        //This updates the value of the active category CSS
        setActiveCategoryCSS(parameter);
    }

    //this function handles the search form
    const handleSubmit = (e) => {
        e.preventDefault();
        getServersInSearch(searchBody)
        .then(response =>{
            setServers(response);
        })
    };

    //handle to request to join a server
    function handleRequestToJoin(parameter, event){
        //Check for the token
        const token = localStorage.getItem("token");
        ReqToJoinServer(parameter, token)
        .then(response =>{
            window.alert(response);
        })
    }


return (
<main>
    <div className="container pt-5">
        <div className="card">
            <div className="card-content">
                <h1 className="title is-1">Explore</h1>
                <p className="subtitle is-3">Find cool servers</p>

                <form onSubmit={handleSubmit}>
                    <div class="field is-grouped">
                    <p class="control is-expanded">
                        <input class="input" type="text" placeholder="Find a cool server" onChange={e => setSearchBody(e.target.value)}/>
                    </p>
                    <p class="control">
                        <button type="submit" name="action" class="button is-info">Search</button>
                    </p>
                    </div>
                </form>

                <div class="tabs is-centered">
                <ul>
                    {serverCategory.map(category =>(
                        <li key={category.id} id={category.id} class="">
                            <a value={category.id} onClick={handleClick.bind(this, category.id)}>
                                <span className="icon is-small"><i className="material-icons">{category.icon}</i></span>
                                <span>{category.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
                </div>
                
                
                <div className="columns pt-1">
                
                {servers.map(server => (
                    <div className="column is-3">
                        <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                            <img src={server.banner} alt="Placeholder image" />
                            </figure>
                        </div>
                        <div className="card-content">
                            <div className="media">
                            <div className="media-left">
                                <figure className="image is-48x48">
                                <img className="is-rounded" src={server.picture} alt="Placeholder image" />
                                </figure>
                            </div>
                            <div className="media-content">
                                <p class="title is-4">{server.title}</p>
                                <p class="subtitle is-6">@{server.user.username}</p>
                            </div>
                            </div>

                            <div class="content">
                                {server.description}
                                <br/>
                                <time datetime="2016-1-1">{server.date}</time>
                            </div>

                            <footer className="card-footer">
                                <a onClick={handleRequestToJoin.bind(this, server.id)} className="card-footer-item">Request Join</a>
                            </footer>
                            
                        </div>
                        </div>

                    </div>
                                ))}
                </div>

            </div>
        </div>
    </div>
</main>
)
}

export default ExploreServers
