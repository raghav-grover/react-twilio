import React, { Component } from 'react';
import TwilioRemoteAndLocalHolder from './TwilioRemoteAndLocalHolder';
import propTypes from 'prop-types';
const Video = require('twilio-video');

class TwilioConnectionManager extends Component {
    constructor(props) {
        super(props);
        this.participantConnected = this.participantConnected.bind(this);
        this.participantDisconnected = this.participantDisconnected.bind(this);
        this.state = {
            tracks: {
                local: [],
                remote: {}
            },
            localAudioMute: false,
            localVideoMute: false
        };
    }

    componentDidMount() {
        let { token, roomName } = this.props;
        this.connectToTwilio(token, roomName);
    }

    componentWillUnMount() {
        //dispose off Video Component
        this.disconnectCall();
    }

    componentWillReceiveProps(nextProps) {
    }

    showTwilioError() {
        this.setState((prevState) => {
            return { ...prevState, errorTwilio: true }
        });
    }

    connectToTwilio(token, roomName) {

        this.token = token;
        //throw new Error();
        Video.createLocalTracks().then((localTrack) => {
            this.localTrack = localTrack;
            Video
                .connect(token, { name: roomName, track: localTrack })
                .then(room => {
                    this.setState((prevState) => { return { ...prevState, currentRoom: room } })
                    this.iterateLocalParticipantTracks(room.localParticipant);
                    room.participants.forEach(this.participantConnected);
                    room.on('participantConnected', this.participantConnected);
                    room.on('participantDisconnected', this.participantDisconnected);
                    room.once('disconnected', error => room.participants.forEach(this.participantDisconnected));
                }, (err) => {
                    this.showTwilioError();
                });
        }, () => {
            this.showTwilioError();
        });
    }

    participantConnected(participant) {
        participant.on('trackAdded', track => this.trackAdded(track, participant));
        participant.on('trackRemoved', track => this.trackRemoved(participant));
    }

    participantDisconnected(participant) {
        let { sid: id } = participant;
        this.setState((prevState) => {
            return {
                ...prevState, tracks: { ...prevState.tracks, remote: { ...prevState.tracks.remote, [id]: [] } }
            }
        })
    }

    iterateLocalParticipantTracks(localParticipant) {
        let tracks = [];
        localParticipant.audioTracks.forEach((track, trackId) => {
            track.isAudio = true;
            return tracks.push(track);
        });
        localParticipant.videoTracks.forEach((track, trackId) => {
            track.isAudio = false;
            if (track.dimensions.width != null && track.dimensions.height != null) {
                return tracks.push(track);
            }
        });
        this.setState((prevState) => {
            return { ...prevState, tracks: { ...prevState.tracks, local: tracks } }
        });
    }


    iterateParticipantTracks(participant) {
        let tracks = [];
        let { sid: id } = participant;
        participant.audioTracks.forEach((track, trackId) => {
            track.isAudio = true;
            tracks.push(track);
        });
        participant.videoTracks.forEach((track, trackId) => {
            track.isAudio = false;
            if (track.dimensions.width != null && track.dimensions.height != null) {
                tracks.push(track);
            }
        });
        this.setState((prevState) => {
            return { ...prevState, tracks: { ...prevState.tracks, remote: { ...prevState.tracks.remote, [id]: tracks } } }
        });
    }

    trackAdded(track, participant) {
        track.on('enabled', () => {
            this.iterateParticipantTracks(participant);
        });
        track.on('started', () => {
            this.iterateParticipantTracks(participant);
        });
        track.on('disabled', () => {
            this.iterateParticipantTracks(participant);
        });
        this.iterateParticipantTracks(participant);
    }

    trackRemoved(participant) {
        this.iterateParticipantTracks(participant);
    }

    disconnectCall() {
        let { currentRoom } = this.state;
        if (currentRoom != null) {
            this.token = null;
            this.setState({ tracks: { remote: {}, local: [] }, disconnected: true });
            currentRoom.disconnect();
        }
    }

    reconnect() {
        let { token } = this.props;
        let { roomName } = this.props;
        if (token != null) {
            this.connectToTwilio(token, roomName);
            this.setState({ disconnected: false });
        }
    }

    render() {
        let { tracks, localAudioMute, localCameraDisabled, room, disconnected, errorTwilio } = this.state;
        let { style } = this.props;
        let { remote, local } = tracks != null ? tracks : { remote: {}, local: [] };
        return (
            <div style={style}>
                <TwilioRemoteAndLocalHolder reconnect={this.reconnect.bind(this)} showDisconnect={disconnected} disconnect={this.disconnectCall.bind(this)} remote={remote} local={local} localAudioMute={localAudioMute} localCameraDisabled={localCameraDisabled} isError={errorTwilio} />
            </div>
        )
    }
}

TwilioConnectionManager.propTypes = {
    roomName: propTypes.string.isRequired,
    token: propTypes.string.isRequired,
    style: propTypes.object.isRequired
}

TwilioConnectionManager.defaultProps = {
    style: {
        border: '1px solid #dcd9d9',
        borderRadius: '4px',
        marginBottom: '15px',
        boxShadow: '5px 5px 5px #e0e3e4',
        fontWeight: 'lighter'
    }
}

export default TwilioConnectionManager;

