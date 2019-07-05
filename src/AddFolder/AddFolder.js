import React, {Component} from 'react';
import ApiContext from '../ApiContext';
import config from '../config'

class AddFolder extends Component {
  static defaultProps ={
    addFolder: () => {},
  }
  static contextType = ApiContext;

  handleFolder = e => {
    e.preventDefault()

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(() => {
        //this.context.addFolder(folderId)
        //this.props.addFolder(folderId)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render () {
    return (
     <form className="addFolderForm" onSubmit={this.handleAddFolder}>
       <h2>Add Folder</h2>
       <div className="form">
         <label htmlFor="name">New Folder Name</label>
         <input type="text" className="newFolderInput"
           name="name" id="name" required/>
       </div>

       <div className="buttonGroup">
        <button type="reset" className="cancelButton">
            Cancel
        </button>
        <button type="submit" className="submitButton">
            Submit
        </button>
       </div>
     </form>
   )
 }
}

export default AddFolder;

