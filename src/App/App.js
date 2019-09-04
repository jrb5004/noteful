import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import UpdateNote from '../UpdateNote/UpdateNote';
import ApiContext from '../ApiContext';
import ApiError from '../ApiError';
import config from '../config';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/api/notes`),
            fetch(`${config.API_ENDPOINT}/api/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

    handleDeleteFolder = folderId => {
        this.setState({
            folders: this.state.folders.filter(folder => folder.id !== folderId)
        })
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        })
    }

    addNote = newNote => {
        console.log(newNote)
        const _this = this
        console.log(this.state.notes)
        this.setState({
            notes: this.state.notes.concat(newNote)
        }, 
    )}

    addFolder = newFolder => {
        console.log('newFolder')
        console.log(this.state.folders)
        this.setState({
            notes: this.state.folders.concat(newFolder)
        }
    )}

    updateNote = updatedNote => {
        const newNotes = this.state.notes.map(note =>
            (note.id === updatedNote.id)
                ? updatedNote
                : note
        )
        this.setState({
            notes: newNotes
        })
    };

    filterNotes = folderId => {
        this.setState({
            notes: this.state.notes.filter(note => note.folder_id !== folderId)
        })
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
                <Route path="/edit/:noteId" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
                <Route path="/edit/:noteId" component={UpdateNote} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote, 
            deleteFolder: this.handleDeleteFolder,
            addNote: this.addNote,
            addFolder: this.addFolder,
            updateNote: this.updateNote,
            filterNotes: this.filterNotes,
        };
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <ApiError>
                        <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    </ApiError>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                        </h1>
                    </header>
                    <ApiError>
                        <main className="App__main">{this.renderMainRoutes()}</main>
                    </ApiError>
                </div>
            </ApiContext.Provider>
        );
    }

}

export default App;