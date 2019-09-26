
import {convertToRaw} from 'draft-js';



export default class Helper {

   downVote(self,context ) {
      let upvotes     =   context.obj.upvotes  - 1;
      var formData    =   this.createFormData({upvotes});
      return formData;
   }


   upVote(self , context ) {
      let upvotes         =   context.obj.upvotes + 1;
      context['formData'] =  this.createFormData({upvotes});
      return this.sendRequest(self, context);
   }


   unFollow(self, context) {
      let followers       =  context.obj.followers - 1;
      context['formData'] =  this.createFormData({followers});
      this.sendRequest(self, context); 
   }


    follow(self,context) {
        let followers = context.obj.followers + 1;
        context['formData'] =  this.createFormData({followers});
        this.sendRequest(self, context); 
    }



    updateReducerListEntynties(listItems, obj) {
      
        listItems.map(( item, index) => {
            if (item.id  === obj.id) {
                Object.assign(listItems[index], obj)
            }
            return listItems;
        });

        return listItems;
    }
      
   createFormData(data ) {
      var formData    =   new FormData();

      if (data) {
         for (var key in data){
            formData.append(key, data[key]);
         }
      }

      return formData;
   };

    _blockText(form) {
        let blocks    =  form.blocks;
        let blockText     =  "";    

        for (var i = blocks.length - 1; i >= 0; i--) {
           console.log(blocks[i].text)
           let text = blocks[i].text;

            if (! /^ *$/.test(text)) {
                console.log(text)
                blockText = text;  
            }
            else{
                console.log(blocks[i].text)
                blockText = "";
            }
        }

        return blockText;
    };

    validateForm(params){
        let validatedForm = {};
        console.log(params.form)

        if (params.editorContents) {
            let form      = convertToRaw(params.editorContents);
            let entityMap = Object.keys(form.entityMap);
            let blockText =   this._blockText(form);
                  
            if (blockText !== "" || entityMap.length) {
                validatedForm = {data: JSON.stringify(form),formIsValid : true,}
            }

            else{
                validatedForm = {
                   formHasErrors : true,
                   formIsValid   : false,
                   errors        : "Form is Empty",
               }
            } 
        }

        else if(params.form){
            let textarea = params.form.textarea;
            if (/^ *$/.test(textarea)) {
                //If textarea field is empty? Return form errors

                validatedForm = {
                    formHasErrors : true,
                    formIsValid   : false,
                    errors        : "Form is Empty",
                }
            }
            else {
                validatedForm = {
                    data          : params.form.textarea,
                    formIsValid   : true,
                    formHasErrors : false
                }
            }
        }

        return validatedForm; 
    }

};








