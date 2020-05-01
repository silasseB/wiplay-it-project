import React from 'react';

export const  NonFieldErrors = errors => {
    if (!errors) return null;

    return(
        <div>
            {errors.non_field_errors && 
                <ul>
                { errors.non_field_errors.map(( error, index) =>
                    <li key={index} className="form-errors">{error}</li>
                )}
                </ul>
            }   
        </div>
    )   
}

export const  EmailFieldErrors = errors => {
    if (!errors) return null;

    return(
        <div>
            {errors.email && 
                <ul>
                    { errors.email.map(( error, index) =>
                        <li key={index} className="form-errors">{error}</li>
                    )}
                </ul>
            }   
        </div>
    )   
};

