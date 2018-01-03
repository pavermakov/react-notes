import React, { Component } from 'react';
import { If, Then, Else } from 'react-if';
import UID from 'uid';
import Note from 'components/note/Note';
import GhostText from 'components/ghost-text/GhostText';

import './Workzone.less';

class Workzone extends Component {
  state = {
    notes: [],
  };

  get hasItems() {
    return this.state.notes.length > 0;
  }

  get currentDepth() {
    if (this.state.notes.length === 0) {
      return 0;
    }

    return this.state.notes[this.state.notes.length - 1].depth;
  }

  componentWillMount() {
    this.getNotes();
  }

  componentDidUpdate() {
    this.saveToStorage();
  }

  render() {
    return (
      <div className="workzone" onDoubleClick={this.handleClick}>
        <If condition={this.hasItems}>
          <Then>
            <div className="workzone__notes">
              { this.state.notes.map(this.renderNote) }
            </div>
          </Then>

          <Else>
            <div className="workzone__fallback">
              <GhostText />
            </div>
          </Else>
        </If>
      </div>
    );
  }

  renderNote = ({ id, x, y, date, text, depth }) => {
    return (
      <Note
        key={id}
        id={id}
        x={x}
        y={y}
        date={date}
        text={text}
        depth={depth}
        onSelect={this.handleNoteSelect}
        onPositionUpdate={this.handleNotePositionUpdate}
        onRemove={this.handleNoteRemove}
        OnNoteTextChange={this.handleNoteTextChange}
      />
    );
  };

  handleClick = (event) => {
    if (event.target.className.indexOf('workzone') === -1) {
      return;
    }

    this.addNote(event);
  };

  addNote = ({ clientX, clientY }) => {
    const newNote = {
      x: clientX - 35,
      y: clientY - 55,
      date: new Date().toDateString(),
      id: UID(),
      depth: this.currentDepth + 1,
      text: '',
    };

    this.setState({
      notes: [ ...this.state.notes, newNote ],
    });
  };

  handleNoteSelect = (id) => {
    this.setState({
      notes: this.state.notes.map(note => note.id === id ? { ...note, depth: this.currentDepth + 1 } : note),
    }, this.refreshDepth);
  };

  handleNotePositionUpdate = (id, x, y) => {
    this.setState({
      notes: this.state.notes.map(note => note.id === id ? { ...note, x, y } : note),
    });
  };

  handleNoteRemove = (id) => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== id),
    });
  };

  refreshDepth = () => {
    this.setState({
      notes: this.state.notes.sort((prev, curr) => prev.depth > curr.depth).map((note, index) => ({ ...note, depth: index + 1 })),
    });
  };

  saveToStorage = () => {
    if (!window.localStorage) {
      return;
    }

    const notes = JSON.stringify(this.state.notes);

    localStorage.setItem('notes', notes);
  };

  getNotes = () => {
    try {
      const notes = JSON.parse(localStorage.getItem('notes'));

      if (notes && notes.length > 0) {
        this.setState({ notes });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleNoteTextChange = (id, text) => {
    this.setState({
      notes: this.state.notes.map(note => note.id === id ? { ...note, text } : note),
    });
  };
}

export default Workzone;
