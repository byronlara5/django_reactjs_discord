import axios from "axios";
import { unsetCurrentUser } from './auth';

export const getServerCategories = (token) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    const promise = axios.get('api/server/getcategories/')
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};

export const getserversInCategory = (token, id) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    const promise = axios.get('api/server/getserverscategory/' + id);
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};

export const getServersInSearch = (title) => {
    const promise = axios.get('api/server/searchserver?search=' + title);
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
}; 

export const CreateNewServer = (picture, banner, title, description, category) => {
    //Headers
    const config = {
        headers : {
            'Content-Type' : 'multipart/form-data',
        }
    };

    let formData = new FormData();
    formData.append("picture", picture);
    formData.append("banner", banner);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    axios
    .post('api/server/createserver/', formData, config)
    .then(response => {
        console.log(formData);
        console.log(response)
    })
    .catch(error => {
        console.log(error);
        window.alert("Error " + error);
    })
    return true;
};

export const getSideNavServers = (token) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    const promise = axios.get('api/server/getservers/');
    const dataPromise = promise.then((response)=> response.data)
    .catch(error =>{
        unsetCurrentUser();
        window.alert("Your token expired you will be redirected to the login page");
        window.location.reload();
    });
    return dataPromise;
};

export const getServerData = (id, token) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    const promise = axios.get('api/server/getserverdetail/' + id);
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};

export const CreateNewCategory = (server_id, title) => {
    //Headers
    const config = {
        headers : {
            'Content-Type' : 'application/json',
        }
    };

    //Request body
    const post_body = JSON.stringify({server_id, title})
    const promise = axios.post('api/server/create-category-channel', post_body, config)
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};

export const CreateNewChannel = (server_id, category_id, title, topic) => {
    //Headers
    const config = {
        headers : {
            'Content-Type' : 'application/json',
        }
    };

    //Request body
    const post_body = JSON.stringify({server_id, category_id, title, topic})
    const promise = axios.post('api/server/create-text-channel', post_body, config)
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};

export const BanFromServer = (user_id, server_id) => {
    const promise = axios.delete('api/server/ban/' + user_id + '/' + server_id);
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};

export const LeaveServer = (server_id) => {
    const promise = axios.delete('api/server/leaveserver/' + server_id);
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};