import React from 'react';
//import JQuery from 'jquery';
let csrftoken = getCookie('csrftoken');

const CSRFToken = () => {
    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
    );
};
export default CSRFToken;

export  function getCookie(name) {
    var cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        
        for (var i = 0; i < cookies.length; i++) {
            var cookie  = cookies[i].split("=");
            console.log(cookies) 
            console.log(cookie) 
            console.log(cookie[i].trim())
                       
            if (name == cookie[i].trim()) {
                cookieValue = decodeURIComponent(cookie[i + 1]);
                break;
            }
        }
    }
    return cookieValue;
};