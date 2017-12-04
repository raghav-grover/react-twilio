import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class Draggable1 extends Component{
    constructor(props){
        super(props);
        this.state= {
            relX: 0,
            relY: 0
        };
        this.onMouseDown=this.onMouseDown.bind(this);
        this.onMouseUp=this.onMouseUp.bind(this);
        this.onMouseMove=this.onMouseMove.bind(this);
    }

    onMouseDown(e) {
        if (e.button !== 0) return;
        const ref = ReactDOM.findDOMNode(this.refs.handle);
        const body = document.body;
        const box = ref.getBoundingClientRect();
        this.setState({
            relX: e.pageX - (box.left + body.scrollLeft - body.clientLeft),
            relY: e.pageY - (box.top + body.scrollTop - body.clientTop)
        });
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
    }

    onMouseUp(e) {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
    }

    onMouseMove(e) {
        let newPos = {
            x: e.pageX - this.state.relX,
            y: e.pageY - this.state.relY
        };
        let { bounds } = this.props;
        if (newPos.x > bounds.x || newPos.y > bounds.y) {
            return;
        }
        if (newPos.x <= 0 || newPos.y <= 0) {
            return;
        }
        this.props.onMove(newPos);
        e.preventDefault();
    }

    render() {
        let { style } = this.props;
        return <div
            onMouseDown={this.onMouseDown}
            style={{
                position: 'absolute',
                left: this.props.x,
                top: this.props.y,
                ...style
            }}
            ref="handle"
        >{this.props.children}</div>;
    }

}

export default Draggable1;
