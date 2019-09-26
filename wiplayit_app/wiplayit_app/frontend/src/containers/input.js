
import React, { Component } from 'react';
import withInput from 'containers/index/input';




class  LinkInput extends Component  {


   componentDidMount() {
      console.log(this.props)
   }

   render(){

      return(
         <div className="hyperlink-form">
            <div className="hyperlink-box">
               <input
                  className="hyperlink-input" 
                  type='text'
                  onChange={this.props.onChange}
                  name="LINK"
                  value={this.props.form.value}
                  placeholder="Enter Url" 
               />

               <button
                  onClick={() => this.props.handleAddLink(this.props.form.value)}
                  className="btn-sm add-link">
                  Add
               </button>
            </div>
         </div>
      )
   }
};

export default withInput(LinkInput); 


