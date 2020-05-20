
import {convertToRaw, convertFromRaw, EditorState} from 'draft-js';
import {decorator} from 'components/draft-js-editor/plugins';
import * as checkType from 'helpers/check-types'; 




export default class Helper {

   
    updateReducerListEntynties(listItems, obj) {
        console.log(listItems,obj)
        if (Array.isArray(listItems) && obj ) {

            listItems.map(( item, index) => {
                if ( item.id  === obj.id) {
                    Object.assign(listItems[index], obj)
                }
                return listItems;
            });

            return listItems;
        }
    };
      
   createFormData(data ) {
      var formData    =   new FormData();

      if (data) {
         for (var key in data){
            formData.append(key, data[key]);
         }
      }

      return formData;
    };


    draftContents =()=>{
        return {
            "blocks":
                [{"key": "dau30","text":"", 
                  "type":"unstyled","depth":0,
                   "inlineStyleRanges":[],
                   "entityRanges":[],
                   "data":{} }
                ],"entityMap":{}
        }
    }


    convertFromRaw =(contents)=>{
        let contentState = contents;

        if (contents.length) {

            for (var i = contents.length - 1; i >= 0; i--) {
                let carecter = contents[i];
            
                if (!contents.includes('{') || !contents.includes('[')) {
                    console.log(contents.charAt(0))
                    let draftContents = this.draftContents();
                    draftContents.blocks[0].text = contents
                    contentState = draftContents
                    console.log(carecter)
                    break
                }

            }
        }
        
        let isString = checkType.isString(contentState)

        if (isString) {
            contentState  = JSON.parse(contentState);
        }

               
        console.log(contentState)
        contentState   = contentState && convertFromRaw(contentState);
        const editorState    = contentState && 
                                EditorState.createWithContent(contentState, decorator);
        return editorState;
    };

    convertToRaw(){
        
    }

    _blockText(form) {
        let blocks    =  form.blocks;
        let blockText     =  "";    

        for (var i = blocks.length - 1; i >= 0; i--) {
           //console.log(blocks[i].text)
           let text = blocks[i].text;

            if (! /^ *$/.test(text)) {
                //console.log(text)
                blockText = text;  
            }
            else{
                //console.log(blocks[i].text)
                blockText = "";
            }
        }

        return blockText;
    };

    validateForm =(params)=> {
        let validatedForm = {};

        let {editorContents, form } = params

        if (editorContents) {
            form      = convertToRaw(editorContents);
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

        else if(form){
            let textarea = form.textarea;
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
                    data          : form.textarea,
                    formIsValid   : true,
                    formHasErrors : false
                }
            }
        }

        return validatedForm; 
    }

};








