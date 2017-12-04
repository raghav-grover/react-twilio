import React from 'react';
import TwilioConnection from './components/TwilioConnectionManager';

class Combined extends React.Component {
  constructor(props) {
    super(props);
    this.token = '';

  }


  render() {
    return (
      <div>
        <TwilioConnection roomName='214' token={this.token} ></TwilioConnection>
      </div>
    );
  }
}
export default Combined;
