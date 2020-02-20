import React from 'react';

export function withInput(Component) {

  return class InputForm extends Component {
      constructor(props) {
         super(props);
         this.state = {
               form : {
               value : "",
            },  
         }

      }


      componentDidMount() {
         console.log(this.props)
      }
  
      onChange(e){
         e.preventDefault();
         let form      = this.state.form;
         form['value'] = e.target.value;
         this.setState({form});
     
      }

      getProps(){
         let props = {
            onChange: this.onChange.bind(this),
            form    : this.state.form,
         }
         return Object.assign(props, this.props);
      }

      render(){
         let props = this.getProps();

         return(
            <Component {...props}/>
         )
      }

   }
};



export default withInput;


