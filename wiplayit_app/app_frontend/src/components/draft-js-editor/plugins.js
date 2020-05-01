import React from "react";
import {
    Modifier,
    SelectionState,
    RichUtils,
    KeyBindingUtil,
    EditorState,
    CompositeDecorator
} from "draft-js";

export const linkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

export const Link = props => {
  const { contentState, entityKey } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      className="link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={url}
    >
      {props.children}
    </a>
  );
};


const addLinkPluginPlugin = {
  keyBindingFn(event, { getEditorState }) {
    const editorState = getEditorState();
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }
    if (KeyBindingUtil.hasCommandModifier(event) && event.which === 75) {
      return "add-link";
    }
  },

  handleKeyCommand(command, editorState, { getEditorState, setEditorState }) {
    if (command !== "add-link") {
      return "not-handled";
    }
    let link = window.prompt("Paste the link -");
    const selection = editorState.getSelection();
    if (!link) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }
    const content = editorState.getCurrentContent();
        const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  },

  decorators: [
    {
      strategy: linkStrategy,
      component: Link
    }
  ]
};

export default addLinkPluginPlugin;



export const insertLink = (editorState, data, text='link') => {
    //const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const textWithSpace = text.concat(' ');
    console.log(textWithSpace)
    // create new content with text
    const newContent = Modifier.insertText(
      contentState,
      selection,
      textWithSpace,
    );
    
    // create new link entity
    const newContentWithEntity = newContent.createEntity(
                                                'LINK',
                                                'MUTABLE',
                                                data,
                                                false
                                            );
      
    const entityKey = newContentWithEntity.getLastCreatedEntityKey();
    // create new selection with the inserted text
    const anchorOffset = selection.getAnchorOffset();

    const newSelection = new SelectionState({
      anchorKey: selection.getAnchorKey(),
      anchorOffset,
      focusKey: selection.getAnchorKey(),
      focusOffset: anchorOffset + text.length,
    });

    // and aply link entity to the inserted text
    const newContentWithLink = Modifier.applyEntity(
      newContentWithEntity,
      newSelection,
      entityKey,
    );

    // create new state with link text
    const withLinkText = EditorState.push(
      editorState,
      newContentWithLink,
      'insert-characters',
    );

    // now lets add cursor right after the inserted link
    const withProperCursor = EditorState.forceSelection(
      withLinkText,
      newContent.getSelectionAfter(),
    );
    // update the editor with all changes
    //this.setState({editorState: withProperCursor });

    return withProperCursor;
  };

