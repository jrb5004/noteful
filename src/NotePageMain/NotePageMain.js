import React from 'react'
import Note from '../Note/Note'
import ApiContext from '../ApiContext'
import { findNote } from '../notes-helpers'
import PropTypes from 'prop-types'
import './NotePageMain.css'
import CircleButton from '../CircleButton/CircleButton'
import { Link } from 'react-router-dom'

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  handleDeleteNote = noteId => {
    this.props.history.push(`/`)
  }

  render() {
    const { notes=[] } = this.context
    const { noteId } = this.props.match.params
    console.log(noteId)
    const note = findNote(notes, noteId) || { content: '' }
    return (
      <section className='NotePageMain'>
        <Note
          id={note.id}
          name={note.name}
          modified={note.modified}
          onDeleteNote={this.handleDeleteNote}
        />
        <div className='NotePageMain__content'>
          {note.content.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
        <div className='NoteListMain__button-container'>
          <CircleButton
            tag={Link}
            to={`/edit/${note.id}`}
            type='button'
            className='NoteListMain__edit-note-button'
          >
            Edit Note
          </CircleButton>
        </div>
      </section>
    )
  }
}

NotePageMain.propTypes = {
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