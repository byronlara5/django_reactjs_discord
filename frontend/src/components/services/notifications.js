import axios from 'axios';

export const SendNewInvitation = (to_user, to_server, token) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;

    //Headers
    const config = {
        headers : {
            'Content-Type' : 'application/json',
        }
    };

    //Request body
    let notification_type = 1;
    const post_body = JSON.stringify({to_user, to_server, notification_type})
    const promise = axios.post('api/notification/createinvitation/', post_body, config)
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};


export const ReqToJoinServer = (to_server, token) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;

    //Headers
    const config = {
        headers : {
            'Content-Type' : 'application/json',
        }
    };

    //Request body
    let notification_type = 2;
    const post_body = JSON.stringify({to_server, notification_type})
    const promise = axios.post('api/notification/invitation/request/', post_body, config)
    const dataPromise = promise.then((response)=> response.data);
    return dataPromise;
};

export const getNotifications = (token) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    const promise = axios.get('api/notification/getnotifications/');
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
};

export const postAcceptInvitation = (token, invitation_id) => {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    const promise = axios.post('api/notification/invitation/' + invitation_id);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
};

export const deleteNotification = (invitation_id) => {
    const promise = axios.delete('api/notification/deletenotification/' + invitation_id);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}; 