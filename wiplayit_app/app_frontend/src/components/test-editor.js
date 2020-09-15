
import React, { Component } from 'react';
import {CharacterMetadata, CompositeDecorator, AtomicBlockUtils,
         RichUtils,convertToRaw, convertFromRaw,Entity,
         genKey, EditorState, ContentBlock, getDefaultKeyBinding} from 'draft-js'; 

import {insertLink, decorator} from 'components/draft-js-editor/plugins'
import {DraftEditor} from  "templates/editor/editor-templates";
import  { _GetApi } from 'dispatch/index';
import {GetLoggedInUser} from 'utils/helpers';
import { CountryDropdown,
	     RegionDropdown, 
	     CountryRegionData } from 'react-country-region-selector';



export class TestEditor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            editorState : EditorState.createEmpty(decorator),
        }

        this.onChange          = this.onChange.bind(this);
    }

    onChange(editorState){
        this.setState({editorState});
    }

    keyBindingFn =(e)=> {
        console.log(e.key)
        if (e.key === 'Delete') {
            return 'delete-me' // name this whatever you want
        }

        //This wasn't the delete key, so we return Draft's default command for this key
        return getDefaultKeyBinding(e)
    }

    render(){
        let props = {
            ...this.props, 
            ...this.state,
            onChange : this.onChange,
            keyBindingFn:this.keyBindingFn,

        }
        return (
            <DraftEditor {...props}/>
        )
    }
    
};

 
 
export class ExampleCountry extends Component {
  	constructor (props) {
    	super(props);
    	this.state = {
    		form : {
    			'first_name' : 'Silasi',
    			last_name    : 'Valoi',
    			password     : 'sila9020',
    			country      : 'ZA',
    	 		sms_code : '0781806487',
    		}
  		};


 	};
 
  	selectCountry =(val)=> {
  		console.log(val)
  		let form = this.state.form;
  		form['country'] = val
    	this.setState({form });

  	};
 
  	handleChange =(event)=> {
  		event.preventDefault();
  		let form = this.state.form;
  		//console.log(event.target.name, event.target.value)
        form[event.target.name] = event.target.value;
        this.setState({form});
        
  	};

  	handleSubmit=(event)=>{
  		event.preventDefault();
  		console.log(event)
  		let form = this.state.form
  		let user = GetLoggedInUser();
  		//4643
  		let useToken = false
    	const Api    = _GetApi(useToken);
    	let pin_url = `rest-auth/account-confirm-phone-number/`
    	let apiUrl   = `rest-auth/registration/`
    	Api.post(pin_url, form)
            .then(response => {
                console.log(response)  
            })
            .catch(error => {
            
                if (error.response) {
                    console.log(error.response)
                }else if(error.request){
                	console.log(error.request)
                    error = 'Something wrong happened.';
                 

                }else{
                 console.log('Client error')
                }
            })

  	}
 
  	render () {
  		console.log(this.state)
    	const {form} = this.state;
    	return (
      		<div>
        		<CountryDropdown
          			value={form.country}
          			labelType="full"
  		  			valueType="short"
          			onChange={(val) => this.selectCountry(val)} 
          		/>
                <form onSubmit={this.handleSubmit}>
                   <div className="username-fields">
                    <div className="name-field-box1 auth-input-field">
                      <input
                        placeholder="First Name"
                        className="first-name-input"
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={this.handleChange}
                        required
                      />

                    </div>  
                    <div className="name-field-box2 auth-input-field">
                      <input
                        placeholder="Last Name"
                        className="last-name-input"
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={this.handleChange}
                        required
                      />
                      
                    </div>

                  </div>

                  <div  className="email-fields signup-fields">
                    <div className="email-box auth-input-field">
                    	<input
                      		placeholder="Phone Number"
                      className="email"
                      type="number"
                      name="sms_code"
                      value={form.sms_code}
                      onChange={this.handleChange}
                      required 
                    />

                  </div>
               </div>
         			

	      		<div className="password-fields signup-fields">
                  <div className="password-box auth-input-field">
                      <input
                        placeholder="Password"
                        className="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={this.handleChange}
                        required
                      />

                  </div>
               </div>


          		
          		<button
                    onClick={() => this.handleSubmit}
                    className="btn-sm add-link">
                        Submit
                </button>
                </form>
     		</div>
    	);
    };
};


