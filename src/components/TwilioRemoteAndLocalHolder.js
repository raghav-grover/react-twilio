import React, { Component } from 'react';
import TwilioAudio from './TwilioAudio';
import TwilioVideo from './TwilioVideo';
import TwilioSecondaryParticipants from './TwilioSecondaryParticipants';
import Draggable from './Draggable';
import ReactLoading from 'react-loading';
import VideoControls from './VideoControls';

class TwilioRemoteAndLocalHolder extends Component {
    constructor(props) {
        super(props);
        let { remote, local, localCameraDisabled, localAudioMute } = this.props;
        let videoProps = {
            video: { remote, local, localCameraDisabled, localAudioMute }
        }
        this.state = { dimensionsChangedCounter: 0, ...videoProps.video, pos: null, currentPrimaryParticipant: null, showSecondaryParticipants: true };
        this.defaultHeight = 480;
        this.defaultWidth = 640;
        this.primaryDimensionsChanged = this.primaryDimensionsChanged.bind(this);
        this.videoTrackClicked = this.videoTrackClicked.bind(this);
        this.hideSecondaryPaticipantsTray = this.hideSecondaryPaticipantsTray.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { remote, local, localCameraDisabled, localAudioMute, error } = nextProps;
        let videoProps = {
            video: { remote, local, localCameraDisabled, localAudioMute }
        }
        let participants = Object.keys(remote);
        let participant = participants.find(participant => remote[participant].length > 0);
        if (participant != null) {
            let { currentPrimaryParticipant: oldPreviousParticipant } = this.state;
            let eligibleCurrent = null;
            if (oldPreviousParticipant != null) {
                eligibleCurrent = this.getIfThePrimaryParticipantDisconnected(nextProps);
            }
            if (eligibleCurrent == null) {
                this.setState((prevState) => {
                    return { ...prevState, currentPrimaryParticipant: oldPreviousParticipant != null ? oldPreviousParticipant : participant }
                });
            }
            else {
                this.setState((prevState) => {
                    return { ...prevState, currentPrimaryParticipant: eligibleCurrent }
                });
            }
        }
        this.getIfNewParticipantJoined(nextProps);
    }

    getIfNewParticipantJoined(newProps) {
        let newParticipants = Object.keys(newProps.remote).length;
        let oldParticipants = Object.keys(this.props.remote).length;
        if (oldParticipants != newParticipants) {
            this.setState((prevState) => {
                return { ...prevState, participantsChanged: newParticipants > oldParticipants ? 1 : -1 }
            });
            setTimeout(() => {
                //Disable the flag, that someone joined
                this.setState((prevState) => {
                    return { ...prevState, participantsChanged: 0 }
                });
            }, 2000);
        };
    }

    getIfThePrimaryParticipantDisconnected(nextProps) {
        let { currentPrimaryParticipant } = this.state;
        let { remote } = nextProps;
        let remoteTracks = nextProps.remote[currentPrimaryParticipant];
        if (remoteTracks.length == 0) {
            //Find new Participant to be primary
            let participants = Object.keys(remote);
            let eligibleParticipant = participants.find(participant => remote[participant].length > 0);
            return eligibleParticipant;
        }
    }

    primaryDimensionsChanged(dimensions) {
        this.setState((prevState) => {
            let { width } = dimensions;
            return { ...prevState, dimensionsChangedCounter: prevState.dimensionsChangedCounter + 1, pos: { x: 0, y: 0 } }
        });
    }

    videoTrackClicked(trackId) {
        let { remote } = this.props;
        let participants = Object.keys(remote);
        let currentPrimaryParticipant = null;
        console.log('Many participants are', participants);
        participants.forEach((participant) => {
            console.log('Participants are', participant);
            let videoFound = remote[participant].find(track => track.id === trackId);
            if (videoFound != null) {
                currentPrimaryParticipant = participant;
            }
        });
        this.setState({ currentPrimaryParticipant });
    }

    getPrimaryVideoId() {
        let { remote } = this.props;
        let { currentPrimayVideo } = this.state;
    }

    showLoadingScreen() {
        let { remote } = this.props;
        if (Object.keys(remote).length == 0) {
            return true;
        }
        let { currentPrimaryParticipant } = this.state;
        if (currentPrimaryParticipant == null) {
            return true;
        }
        return remote[currentPrimaryParticipant].filter(track => !track.isAudio).filter(track => track.isEnabled).length == 0 ? true : false;
    }

    hideSecondaryPaticipantsTray() {
        this.setState((prevState) => {
            return { ...prevState, showSecondaryParticipants: !prevState.showSecondaryParticipants }
        });
    }

    render() {
        let { remote, local, showDisconnect, reconnect, isError } = this.props;
        let { currentPrimaryParticipant, localCameraDisabled, localAudioMute, showSecondaryParticipants, participantsChanged } = this.state;
        let { height, width } = { width: '100%', height: '100%' }
        let heightNum = height;
        let widthNum = width;
        let ratio = height / width;
        let { pos } = this.state;
        let x, y;
        if (pos != null) {
            x = pos.x;
            y = pos.y;
        } else {
            x = 0;
            y = 0;
        }
        let rightMargin = 5;
        let secondaryStyles = {
            height: '20%', width: '20%',
            position: 'absolute', right: '5%', bottom: ratio > 1 ? '-5%' : '5%',
            zIndex: 999
        };
        let controlChildStyle = { margin: '13%', width: '30px', height: '30px' };
        let myCameraStyle = { width: '20%' };
        let rightMarginCountCalculator = 0;
        let participants = Object.keys(remote);
        let primaryVideo = null;
        let newParticipantStatement = 'A participant';
        participantsChanged == 1 ? newParticipantStatement += ' joined' : newParticipantStatement += ' left';
        if (currentPrimaryParticipant != null) {
            if (remote[currentPrimaryParticipant]) {
                primaryVideo = remote[currentPrimaryParticipant].find(track => !track.isAudio);
                //Pick up the first video track for primary participant 
            }
        }
        return (
            this.showLoadingScreen() ?
                <div style={{
                    height: height, width: width, position: 'relative', overflow: 'hidden',
                    textAlign: 'center', display: 'table'
                }}>

                    {
                        !showDisconnect && !isError
                        &&
                        <div style={{ height: '200px', verticalAlign: 'middle', display: 'table-cell' }}>
                            Connecting to Room
                            <ReactLoading type={'bars'} style={{ marginLeft: '40%', marginBottom: '10%', height: '20%', width: '20%', fill: 'blue' }} />
                        </div>
                    }
                    {
                        isError
                        &&
                        <div style={{ height: '200px', verticalAlign: 'middle', display: 'table-cell' }}>
                            Not able to connect, some error occured
                        </div>
                    }
                    {
                        showDisconnect
                        &&
                        <div style={{ height: '200px', verticalAlign: 'middle', display: 'table-cell' }}>
                            <div>
                                Reconnect
                                <img style={controlChildStyle} onClick={() => {
                                    reconnect()
                                }} src={reconnectIcon} />
                            </div>
                        </div>
                    }
                </div> : <div style={{ height: height, width: width, background: 'rgb(151, 160, 160)', borderColor: 'black', borderWidth: '1px', textAlign: 'center' }}>
                    {

                        !showDisconnect && !isError
                        &&
                        <div style={{
                            width: '100%', position: 'relative', overflow: 'hidden', float: 'left', height: height
                        }}>
                            {
                                participantsChanged != 0
                                &&
                                <div style={{ ...secondaryStyles, width: '50%', height: '5%', right: '5%', top: '5%', background: 'rgba(26,26,26,0.5)', color: 'white' }}>
                                    {newParticipantStatement}
                                </div>
                            }

                            {
                                primaryVideo != null
                                &&
                                <TwilioVideo style={{
                                    height: height, width: width
                                }}
                                    cameraDisabled={false} tracks={[primaryVideo]} onClick={(myid) => { this.videoTrackClicked(myid) }} remote={true} key={primaryVideo.id} primary={true} primaryDimensionChanged={this.primaryDimensionsChanged}></TwilioVideo>

                            }
                            {
                                showSecondaryParticipants
                                &&
                                <TwilioSecondaryParticipants style={secondaryStyles} remote={remote} participants={participants.filter(participant => participant != currentPrimaryParticipant)} onVideoClick={(myid) => { this.videoTrackClicked(myid) }} hideClick={this.hideSecondaryPaticipantsTray} />
                            }

                            {
                                participants.map((participant) => {
                                    return remote[participant].filter(track => track.isAudio).map((track) => {
                                        return (
                                            <TwilioAudio style={{
                                                height: '0px', width: '0px'
                                            }}
                                                mute={false} tracks={[track]} remote={true} key={track.id}></TwilioAudio>
                                        )
                                    });
                                })
                            }

                            {/* <TwilioVideo  cameraDisabled={localCameraDisabled} mute={localAudioMute} tracks={local} remote={false}></TwilioVideo> */}
                            {
                                !localCameraDisabled
                                &&
                                <Draggable bounds={{ x: widthNum - 0.2 * widthNum, y: heightNum - 0.2 * heightNum }} x={x} y={y} style={myCameraStyle} onMove={(e) => { this.setState({ pos: e }) }}>
                                    <TwilioVideo style={{ width: '100%', height: '100%' }} cameraDisabled={localCameraDisabled} onClick={() => { }} tracks={local.filter(track => !track.isAudio)} remote={false} secondaryDimensionChanged={this.primaryDimensionsChanged}></TwilioVideo>
                                </Draggable>
                            }
                            <VideoControls
                                localAudioToggle={() => {
                                    this.setState((prevState) => {
                                        return { ...prevState, localAudioMute: !prevState.localAudioMute }
                                    })
                                }}
                                localCameraToggle={() => {
                                    this.setState((prevState) => {
                                        return { ...prevState, localCameraDisabled: !prevState.localCameraDisabled }
                                    })
                                }}
                                disconnectCall={() => { this.props.disconnect() }}
                                showBar={this.hideSecondaryPaticipantsTray}

                            >
                            </VideoControls>

                            <TwilioAudio style={{ height: '0px', width: '0px' }}
                                mute={localAudioMute} tracks={local.filter(track => track.isAudio)} remote={false}></TwilioAudio>
                        </div>
                    }
                </div>

        )
    }
}

export default TwilioRemoteAndLocalHolder;