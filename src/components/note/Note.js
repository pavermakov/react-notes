import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ResizedArea from "react-textarea-autosize";
import PropTypes from 'prop-types';

import './Note.less';

class Note extends Component {
  state = {
    isHeaderDown: false,
    originX: 0,
    originY: 0,
  };

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.textarea).focus();

    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  render() {
    const { id, x, y, text, depth, date } = this.props;

    return (
      <div className="note" style={{ 'top': y, 'left': x, 'zIndex': depth }} onMouseDown={this.handleMouseDown(id)} ref="note">
        <div className="note__header" onMouseDown={this.holdHeader} onMouseUp={this.releaseHeader}>
          <span className="note__date">{ date }</span>

          <span className="note__remove">
            <img className="note__icon" src="/images/trash.svg" alt="remove note" />
          </span>
        </div>

        <div className="note__body">
          <ResizedArea className="note__area" defaultValue={text} ref="textarea" />
        </div>
      </div>
    );
  }

  holdHeader = (event) => {
    this.setState({
      isHeaderDown: true,
      originX: event.clientX,
      originY: event.clientY,
    });
  };

  releaseHeader = () => {
    this.setState({
      isHeaderDown: false,
      originX: 0,
      originY: 0,
    });
  };

  handleMouseMove = (event) => {
    if (!this.state.isHeaderDown) return;

    // get the cursor position x, y
    const cursorX = this.state.originX - event.clientX;
    const cursorY = this.state.originY - event.clientY;

    // reset origin
    this.setState({
      originX: event.clientX,
      originY: event.clientY,
    });

    // new position for the note
    const newX = this.refs.note.offsetLeft - cursorX;
    const newY = this.refs.note.offsetTop - cursorY;

    this.props.onPositionUpdate(this.props.id, newX, newY);
  };

  handleMouseDown = (id) => () => {
    this.props.onSelect(id);
  };
}

Note.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default Note;
