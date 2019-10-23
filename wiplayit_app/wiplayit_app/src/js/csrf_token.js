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
        console.log(cookies.length)
        
        for (var i = 0; i < cookies.length; i++) {
            var cookie  = cookies[i].split("=");
            console.log(cookie[i])

            
            if (cookie) {
                console.log(cookie[i]

                if (name === cookie[i]) {
                    cookieValue = decodeURIComponent(cookie[i + 1]);
                    break;
                }
            }
        }
    }
    return cookieValue;
};