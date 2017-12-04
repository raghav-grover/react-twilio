import React, { Component } from 'react';
import TwilioVideo from './TwilioVideo';
let closeIcon = require('../images/error.png');

class TwilioSecondaryParticipants extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    getActiveParticipants() {
        let { participants, remote } = this.props;
        let count = 0;
        participants.forEach((participant) => {
            count = count + remote[participant].length;
        })
        return count > 0 ? true : false;
    }

    render() {
        let { participants, remote, onVideoClick, style, hideClick } = this.props;
        let newStyle = { bottom: '0px', height: '20%', width: '100%', position: 'absolute', bottom: '13%' }
        return (
            <div style={{ ...newStyle }}>
                {
                    this.getActiveParticipants()
                    &&
                    <img src={closeIcon} style={{ float: 'left', position: 'absolute', left: '0' }} height='20px' width='20px' onClick={() => {
                        hideClick();
                    }} />
                }
                <div style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'no-wrap', justifyContent: 'flex-start', zIndex: '900', overflow: 'scroll', background: 'rgba(26,26,26,0.5)' }}>
                    {
                        participants.map((participant) => {
                            return remote[participant].filter(track => !track.isAudio).map((track, index) => {
                                let { id } = track;
                                return (
                                    <TwilioVideo style={{ margin: '1%', zIndex: '999', width: '15%', position: 'relative', height: '100%', flex: '0 0 15%', top: '10%' }}
                                        cameraDisabled={false} onClick={(myid) => { onVideoClick(myid) }} tracks={[track]} secondaryDimensionChanged={() => { }} remote={true} key={id}></TwilioVideo>
                                )
                            })
                        })
                    }
                </div>
            </div>
        )
    }
}
export default TwilioSecondaryParticipants;