# react-twilio 

React twilio is a react powered multi-participant Twilio Component, having controls to mute, disable camera and disconnect.

  - Supports mute option and camera disable option
  - Supports disconnect/reconnect feature
  - Supports multiple participants, any of the participants can be switched to the full screen.
  - Flashes a notification, when a participant is added or leaves the room
  - Fully built in React :)
## Getting Started

To install: `npm install react-twilio`

#### Connecting to Room
![Connect to room](https://thumbs.gfycat.com/HandyHeavenlyGyrfalcon-size_restricted.gif)

#### How it works 
![How it works](https://thumbs.gfycat.com/DependentUntriedLeech-size_restricted.gif)

### React Twilio
To connect to a room, simply pass the roomname in the props along with the Auth Token
```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TwilioVideo from 'react-twilio';

class App extends Component {
  constructor(props) {
    super(props);
    this.shadowStyle = {
      border: '1px solid #dcd9d9',
      borderRadius: '4px',
      marginBottom: '15px',
      boxShadow: '5px 5px 5px #e0e3e4',
      fontWeight: 'lighter'
    }
    let obj = { token: "xxx-your-token-yyy" }
    this.token = obj.token;
  }
  render() {
    return (
      <div style={{ heigh: '800px', width: '50%' }}>
        <TwilioVideo roomName={'214'} token={this.token} style={{ ...this.shadowStyle, boxShadow: '5px 5px 5px #e0e3e4' }} />
      </div>
    );
  }
}

export default App;
```

## Acknowledgements
  - Hat tip to anyone who uses and contributes to the code.
  - For Twilio team, who has such an extensive documentation.