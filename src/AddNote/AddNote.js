import React, {Component} from 'react';
import { withRouter } from "react-router-dom"
import ApiContext from '../ApiContext';
import config from '../config';
import './AddNote.css';


class AddNote extends Component {
  static defaultProps ={
    addNote: () => {},
  }

  static contextType = ApiContext;

  constructor() {
    super();
    this.state = {
        noteName: '',
        content: '',
        activeFolder: {}
    }
    this.handleAddNote = this.handleAddNote.bind(this)
}

  setNoteName(event) {
    this.setState({
        noteName:event.target.value
    })
  }

  setContent(event) {
    this.setState({
        content: event.target.value
    })
  }

  isActive(folder) { 
    if (this.state.activeFolder.id === folder.id) return '1px solid white' 
    else return '' 
  }

  updateFolder(folder) { 
    this.setState({
      activeFolder: folder
  })
}


  handleAddNote = e => {
    e.preventDefault()
    console.log (this.state)


    let noteId = this.state.noteName

    if (!this.state.noteName || this.state.noteName.trim() == '') { 
      alert('name is required') 
      return 
    }

    let body = {
      name: this.state.noteName,
        folderId: this.state.activeFolder.id,
        content: this.state.content
    }

    console.log(body)

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(() => {
        this.context.addNote(noteId)
        this.props.addNote(noteId)
        this.props.history.push("/")
        window.location.reload();
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render () {
    return (
     <form className="addNoteForm" onSubmit={this.handleAddNote}>
       <h2 className="AddNote__form-title">Add Note</h2>
       <div className="AddNote__form">
         <div className="formItem">
          <label htmlFor="name" className="AddNote__form-label">Note Name: </label>
          <input type="text"
            name="name" id="name" onChange={(e) => this.setNoteName(e)} required/>
         </div>
         <div className="formItem">
          <label htmlFor="name" className="AddNote__form-label">Note Content: </label>
          <input type="text"
            name="content" id="content" className="contentInput" onChange={(e) => this.setContent(e)} required/>
        </div>
        <div className="formItem">
          <label htmlFor="name" className="AddNote__form-label">Folder (select one): </label>
          {this.context.folders.map(folder => {
            return <div style={{ border: this.isActive(folder) }} onClick={() => this.updateFolder(folder)} id={folder.id} key={folder.id}><p>{folder.name}</p></div>
            })
          }
        </div>
       </div>

       <div className="AddNote__button-group">
        <button type="submit" className="AddNote__submit-button">
            Submit
        </button>
       </div>
     </form>
   )
 }
}
 
export default withRouter(AddNote);