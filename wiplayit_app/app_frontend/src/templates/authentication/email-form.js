import React from 'react';
import  AjaxLoader from "templates/ajax-loader";





export const EmailForm = props => {
    console.log(props)

    let { submitting ,onSignUpForm,
          onPasswordResetForm, successMessage,
          onEmailResendForm, form, formIsValid, formName, validateForm } = props;

    form = form && form[formName]? 
                           form[formName]:null;
    let error = form && form.error; 

    formIsValid =  onPasswordResetForm || onEmailResendForm?
                             validateForm(form, formName):false;

    let email = successMessage?props.email:null;

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{};
    let toggleProps = {successMessage:false, value:true, formName}

   
    return(
        <div>
            { form? 
               <div className="email-form-box">
                    <p className="password-reset-form-title">
          
                    </p>

            { successMessage && !submitting?
               <div className="success-message-box">
                    <p className="message-success">
                         {successMessage}
                    </p>

                    <div className="resend-email-box ">
                        <button type="button" onClick={()=> props.toggleEmailForm(toggleProps)}
                                 className="resend-email-btn" >
                           Resend
                        </button>
                        <CancelEmailForm {...props}/>
                    </div>
                </div>
            :

            <form className="email-form" onSubmit={props.onSubmit}>
                <NavBarSmallScreen {...props}/> 
                 <li className="password-form-description">{props.formDescription}</li>
                    {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="form-errors">{error}</li>
                                )}
                            </div>
                            :
                            ""
                    }         
                <fieldset style={ fieldSetStyles} 
                      disabled={ submitting || onSignUpForm} >

                    <div  className="email-fields">
                       {error && error.email && error.email.length?
                            <div>
                                { error.email.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
                                )}
                            </div>
                            :
                            ""
                        }

                        <p></p>
                        <div className="email-box">
                            <input
                               placeholder="Email"
                               className="email"
                               type="email"
                               name="email"
                               value={form.email}
                               onChange={props.handleFormChange}
                               required
                       
                            />

                        </div>
                    </div>

                    <div className="registration-btn-box">
                        <SubmitBtnBigScreen {...props}/>
                        
                        <CancelEmailForm {...props}/>
                  
                    </div>

                </fieldset>    

            </form>

            }

            { onSignUpForm?
            
            ""
            :
            <SpinLoader {...props}/> 
              
          }  
        </div>

        :
        ""
        }
    </div>

   )
}


export default EmailForm;