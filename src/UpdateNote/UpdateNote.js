import React, {Component} from 'react';
import { withRouter } from "react-router-dom"
import ApiContext from '../ApiContext';
import config from '../config';
import './UpdateNote.css';


class UpdateNote extends Component {
  static defaultProps ={
    updateNote: () => {},
  }

  static contextType = ApiContext;

  constructor() {
    super();
    this.state = {
        name: '',
        content: '',
        activeFolder: {},
        folder_id: null,
        id: null,
        modified: ''
    }
    this.handleUpdateNote = this.handleUpdateNote.bind(this)
}

  componentDidMount() {
    const { noteId } = this.props.match.params
    fetch(`${config.API_ENDPOINT}/api/notes/${noteId}`, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${config.API_KEY}`
    }})
    .then((notesRes) => {
        if (!notesRes.ok)
            return notesRes.json().then(e => Promise.reject(e));

        return notesRes.json();
    })
    .then((notes) => {
      console.log(notes)  
      this.setState({ ...notes, activeFolder: {id: notes.folder_id}})
      console.log(this.state)
    })
    .catch(error => {
        console.error({error});
    });
  }

  setNoteName(event) {
    this.setState({
        name:event.target.value
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


  handleUpdateNote = e => {
    e.preventDefault()
    console.log (this.state)

    const { noteId } = this.props.match.params

    if (!this.state.name || this.state.name.trim() == '') { 
      alert('name is required') 
      return 
    }

    let body = {
      name: this.state.name,
      folder_id: this.state.activeFolder.id,
      content: this.state.content
    }

    console.log(body)


    fetch(`${config.API_ENDPOINT}/api/notes/${noteId}`, {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      },
      method: 'PATCH',
      body: JSON.stringify(body)
    })

      .then(res => {
        console.log(res)
        if (!res.ok)
          return (Promise.reject('Reject error'))
        return 
      })
      .then(() => {
        this.context.updateNote(noteId)
        this.props.updateNote(noteId)
        this.props.history.push("/")
        window.location.reload();
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render () {
    const { name, content, folder_id } = this.state
    return (
     <form className="updateNoteForm" onSubmit={this.handleUpdateNote}>
       <h2 className="UpdateNote__form-title">Update Note</h2>
       <div className="UpdateNote__form">
         <div className="formItem">
          <label htmlFor="name" className="UpdateNote__form-label">Note Name: </label>
          <input type="text"
            name="name" id="name" className="nameInput" value={name} onChange={(e) => this.setNoteName(e)} required/>
         </div>
         <div className="formItem">
          <label htmlFor="name" className="UpdateNote__form-label">Note Content: </label>
          <input type="text"
            name="content" id="content" className="contentInput" value={content} onChange={(e) => this.setContent(e)} required/>
        </div>
        <div className="formItem">
          <label htmlFor="name" className="UpdateNote__form-label">Folder (select one): </label>
          {this.context.folders.map(folder => {
            return <div style={{ border: this.isActive(folder) }} onClick={() => this.updateFolder(folder)} id={folder.id} key={folder.id}><p>{folder.name}</p></div>
            })
          }
        </div>
       </div>

       <div className="UpdateNote__button-group">
        <button type="submit" className="UpdateNote__submit-button">
            Submit
        </button>
       </div>
     </form>
   )
 }
}
 
export default withRouter(UpdateNote);