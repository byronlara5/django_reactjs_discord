import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { getServerCategories, CreateNewServer } from '../services/Servers';

function CreateServer() {

    let history = useHistory();
    const [picture, setPicture] = useState();
    const [banner, setBanner] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [formCategory, setFormCategory] = useState();

    const [serverCategory, setserverCategory] = useState([]);

    const fileNamePicture = document.querySelector('#picture-file .file-name');
    const fileNameBanner = document.querySelector('#banner-file .file-name');


    useEffect(()=> {
        //Check for the token
        const token = localStorage.getItem("token");
        //Request to get all the categories
        getServerCategories(token)
        .then(response => {
            setserverCategory(response);
        })
    },[]);



    const handleSubmit = (e)=> {
        e.preventDefault();
        const serverCreated = CreateNewServer(picture, banner, title, description, formCategory);
        if(serverCreated === true){
            history.push("/");
        }
    };


return (
<main>
    <div className="container pt-6">
        <div className="card">
            <div className="card-content">

                <form onSubmit={handleSubmit}>
                    <h3 className="title is-3">Le Discord - Create New Server</h3>

                    <div className="field">
                    <div id="picture-file" class="file is-medium has-name">
                    <label class="file-label">
                        <input id="picture" class="file-input" type="file" name="picture" onChange={e => {
                            setPicture(e.target.files[0])
                            //This is to set the name of the filename to the span tag
                            let fileInput = document.getElementById('picture');
                            if (fileInput.files.length > 0){
                                fileNamePicture.textContent = fileInput.files[0].name;
                            }
                        }} />
                        <span class="file-cta">
                        <span class="file-icon">
                            <i class="material-icons">file_upload</i>
                        </span>
                        <span class="file-label">Choose a Picture</span>
                        </span>
                        <span class="file-name"></span>
                    </label>
                    </div>
                    </div>

                    <div className="field">
                    <div id="banner-file" class="file is-medium has-name">
                    <label class="file-label">
                        <input id="banner" class="file-input" type="file" name="banner" onChange={e => {
                            setBanner(e.target.files[0])
                            //This is to set the name of the filename to the span tag
                            let fileInput = document.getElementById('banner');
                            if (fileInput.files.length > 0){
                                fileNameBanner.textContent = fileInput.files[0].name;
                            }
                        }} />
                        <span class="file-cta">
                        <span class="file-icon">
                            <i class="material-icons">file_upload</i>
                        </span>
                        <span class="file-label">Choose a Banner</span>
                        </span>
                        <span class="file-name"></span>
                    </label>
                    </div>
                    </div>

                    <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                        <input id="title" name="title" class="input" type="text" placeholder="Text input"
                        onChange={e => setTitle(e.target.value)}/>
                    </div>
                    </div>

                    <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                        <textarea id="description" name="description" class="textarea" placeholder="Textarea"
                        onChange={e => setDescription(e.target.value)}></textarea>
                    </div>
                    </div>

                    <div class="field">
                    <label class="label">Category</label>
                    <div class="control">
                        <div class="select">
                        <select onChange={e => setFormCategory(e.target.value)}>
                            <option value="" disabled>Choose the category</option>
                            {serverCategory.map(category =>( 
                                <option key={category.id} value={category.id}>{category.title}</option>
                            ))}
                        </select>
                        </div>
                    </div>
                    </div>

                    <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-link">Submit</button>
                    </div>
                    <div class="control">
                        <button class="button is-link is-light">Cancel</button>
                    </div>
                    </div>

                </form>

            </div>
        </div>
    </div> 
</main>
)
}

export default CreateServer
