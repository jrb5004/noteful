import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import { countNotesForFolder, findFolder } from '../notes-helpers'
import PropTypes from 'prop-types'
import config from '../config'
import './NoteListNav.css'

export default class NoteListNav extends React.Component {
  static contextType = ApiContext;

  handleButtonClick() {
  }

  handleClickDelete = (folderId) => {

    console.log(folderId)

    fetch(`${config.API_ENDPOINT}/api/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then(res => {
        if (!res.ok)
          return Promise.reject('error deleting folder')
        return 
      })
      .then(() => {
        this.context.deleteFolder(folderId)
        this.context.filterNotes(folderId)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders=[], notes=[] } = this.context
    return (
      <div className='NoteListNav'>
        <ul className='NoteListNav__list'>
          {folders.map(folder =>
            <li className='NoteListNav_folders' key={folder.id}>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                <span className='NoteListNav__num-notes'>
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.name}
              </NavLink>
                <button
                className='Folder__delete'
                type='button'
                onClick={() => this.handleClickDelete(folder.id)}
              >
                {' '}
                remove
              </button>
            </li>
          )}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CircleButton
            tag={Link}
            to='/add-folder'
            type='button'
            className='NoteListNav__add-folder-button'
            onClick={() => this.handleButtonClick()}
          >
            
            Add Folder
          </CircleButton>
        </div>
      </div>
    )
  }

}

NoteListNav.propTypes = {
  Notes: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.string.isRequired,
    folderId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  Folders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }))
}