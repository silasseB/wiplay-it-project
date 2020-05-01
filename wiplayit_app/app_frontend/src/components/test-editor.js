
import React, { Component } from 'react';
import AppEditor  from 'components/draft-js-editor/editor';



export const TestEditor = (props)=> {

    const modalProps = { modalName : 'editor' };

    return <AppEditor {...modalProps}/>
    
};

