import React, { Component } from 'react';
import propTypes from 'prop-types';

class TwilioAudio extends Component {
    //This Component demands a video object, which is given to it by the overlying layer as a prop
    constructor(props) {
        super(props);
        this.state = {

        };
        this.alreadyAdded = [];
        this.mute = false;
    }

    componentDidMount() {
        this.attachTracksToDOM(this.props.tracks);
    }

    componentWillReceiveProps(nextProps) {
        let { mute, tracks } = nextProps;
        if (mute != this.mute) {
            this.toggleAudioTrack(tracks);
        }
    }

    componentDidUpdate() {
        this.attachTracksToDOM(this.props.tracks);
    }

    attachTracksToDOM(tracks) {
        tracks.forEach((track) => {
            if (this.alreadyAdded.indexOf(track.id) == -1) {
                this.alreadyAdded.push(track.id);
                this.audioDiv.appendChild(track.attach());
                //this.refs[track.id].appendChild(track.attach());
            }
        });
    }

    toggleAudioTrack(tracks) {
        this.mute = this.mute ? false : true;
        tracks.filter(track => track.isAudio).forEach((track) => {
            this.mute ? track.disable() : track.enable()
        });
    }

    render() {
        let { tracks, remote, style } = this.props;
        return (
            <div style={{ height: '0px', width: '0px' }} >
                {
                    tracks.map((track) => {
                        return <div key={track.id} ref={(div)=>{this.audioDiv=div;}}>
                        </div>
                    })
                }
            </div>
        )
    }
}


TwilioAudio.propTypes = {
    tracks: propTypes.array.isRequired,
    mute: propTypes.bool
}


export default TwilioAudio;

