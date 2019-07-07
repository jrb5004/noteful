import React, {Component} from 'react';
import { withRouter } from "react-router-dom"
import ApiContext from '../ApiContext';
import config from '../config'
import './AddFolder.css'

class AddFolder extends Component {
  static defaultProps ={
    addFolder: () => {},
  }

  static contextType = ApiContext;

  constructor() {
    super();
    this.state = {
        folderName: '',
    }
    this.handleFolder = this.handleFolder.bind(this)
}

  setFolderName(event) {
    this.setState({
      folderName:event.target.value
    })
  }

  handleFolder = e => {
    e.preventDefault()

    let folderId = this.state.folderName

    if (!this.state.folderName || this.state.folderName.trim() == '') { 
      alert('name is required') 
      return 
    }
    
    let body = {
      name: this.state.folderName,
    }

    fetch(`${config.API_ENDPOINT}/folders`, {
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
        this.context.addFolder(folderId)
        this.props.addFolder(folderId)
        this.props.history.push("/")
        window.location.reload();
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render () {
    return (
     <form className="addFolderForm" onSubmit={this.handleFolder}>
       <h2>Add Folder</h2>
       <div className="form">
         <label htmlFor="name">New Folder Name: </label>
         <input type="text" className="newFolderInput"
           name="name" id="name" onChange={(e) => this.setFolderName(e)} required/>
       </div>

       <div className="AddFolder__button-group">
        <button type="submit" className="AddFolder__submit-button">
            Submit
        </button>
       </div>
     </form>
   )
 }
}

export default withRouter(AddFolder);

