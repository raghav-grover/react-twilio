import React, { Component } from 'react';
import propTypes from 'prop-types';
let absoluteUrl = 'http://localhost:3001/';
let url = absoluteUrl + 'images/';
let mute = url + 'mute.png';
let unmute = url + 'unmute.png';
let camera = url + 'camera.png';
let uncamera = url + 'uncamera.png';
let disconnect = url + 'disconnect.png';
let reconnectIcon = url + 'reconnect.png';
let closeIcon = url + 'error.png';
let showBar = url + 'showBar.png';

class VideoControls extends Component {
    constructor(props) {
        super(props);
        this.state = { localAudioMute: false, localCameraDisabled: false };
        this.videoControlStyle = {
            height: '50px', width: '100%',
            position: 'absolute', bottom: '0%'
        };
        this.imageWrapperStryle = {
            height: '40px',
            width: '40px',
            background: 'rgba(243,238,238,0.5)',
            borderRadius: '50%',
            float: 'left',
            marginLeft: '5px'
        }
    }

    render() {
        let { localAudioMute, localCameraDisabled } = this.state;
        let { disconnectCall, showBar: showBarFunc } = this.props;
        let controlChildStyle = { margin: '13%', width: '30px', height: '30px' }
        let { imageWrapperStryle } = this;
        return (
            <div style={this.videoControlStyle}>
                <div style={imageWrapperStryle}>
                    <img style={controlChildStyle} onClick={() => {
                        this.props.localAudioToggle();
                        this.setState((prevState) => { return { ...prevState, localAudioMute: !prevState.localAudioMute } })
                    }} src={localAudioMute ? mute : unmute} />
                </div>
                <div style={imageWrapperStryle}>
                    <img style={controlChildStyle} onClick={() => {
                        this.props.localCameraToggle();
                        this.setState((prevState) => { return { ...prevState, localCameraDisabled: !prevState.localCameraDisabled } })
                    }} src={localCameraDisabled ? uncamera : camera} />
                </div>
                <div style={{ ...imageWrapperStryle, background: 'rgba(255,0,0,0.8)' }}>
                    <img style={controlChildStyle} onClick={() => {
                        disconnectCall();
                    }} src={disconnect} />
                </div>
                <div style={imageWrapperStryle}>
                    <img style={controlChildStyle} onClick={() => {
                        showBarFunc();
                    }} src={showBar} />
                </div>

            </div>
        )
    }

}
export default VideoControls;