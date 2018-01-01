import React, { Component } from 'react';
import { If, Then, Else } from 'react-if';
import GhostText from 'components/ghost-text/GhostText';

import './Workzone.less';

class Workzone extends Component {
  state = {
    notes: [],
  };

  get hasItems() {
    return this.state.notes.length > 0;
  }

  render() {
    return (
      <div className="workzone">
        <If condition={this.hasItems}>
          <Then>
            there are a few notes
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
}

export default Workzone;
