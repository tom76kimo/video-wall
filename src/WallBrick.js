import React from 'react';

class WallBrick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null,
    };
  }
  render() {
    const wallIndex = this.props.wallIndex;
    let classString;
    switch (wallIndex) {
      case 0:
      case 4:
        classString = 'wall-brick-small';
        break;
      case 1:
      case 3:
        classString = 'wall-brick-medium';
        break;
      case 2:
        classString = 'wall-brick-big';
        break;
    }
    return (
      <div className={classString} style={{opacity: this.state.imgSrc ? 1 : 0}}>
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
