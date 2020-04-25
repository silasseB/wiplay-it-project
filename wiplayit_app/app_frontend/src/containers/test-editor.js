
import React, { Component } from 'react';
import AppEditor  from 'containers/editor';



export const TestEditor = (props)=> {

    const modalProps = { modalName : 'editor' };

    return <AppEditor {...modalProps}/>
    
};

