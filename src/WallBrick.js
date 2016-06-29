import React from 'react';

class WallBrick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null,
    };
  }
  render() {
    return (
      <div className="wall-brick" style={{opacity: this.state.imgSrc ? 1 : 0}}>
        <img height="100%" src={this.state.imgSrc} />
        { this.state.mouseEnter ? null : <div className="wall-brick-cover"></div> }
      </div>
    );
  }
  componentDidMount() {
    const img = document.createElement('img');
    const self = this;
    img.onload = () => {
      self.setState({
        imgSrc: self.props.src,
      })
    };
    img.src = this.props.src;
  }
}

export default WallBrick;
