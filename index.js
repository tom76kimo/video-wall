import React from 'react';
import ReactDom from 'react-dom';
import GapiInit from './src/gapiInit';
import WallBrick from './src/WallBrick';
import async from 'async';

let globalParams = {};

GapiInit(globalParams);

class Wall extends React.Component {
  render() {
    if (!this.props.items) {
      return (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      );
    }
    let itemComponents = [];
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const brickWidth = Math.floor(windowWidth / 6);
    const items = this.props.items;
    items.forEach((item, index) => {
      const wallIndex = index % 5;
      const thumbnails = item.snippet.thumbnails;
      const imgSrc = thumbnails.maxres ? thumbnails.maxres.url : thumbnails.medium.url;
      if (!itemComponents[wallIndex]) {
        itemComponents[wallIndex] = [];
      }
      itemComponents[wallIndex].push (
          <WallBrick key={index} src={imgSrc} />
      );
    });
    return (
      <div>
        <div className="wall-brick-small">{ itemComponents[0] }</div>
        <div className="wall-brick-medium">{ itemComponents[1] }</div>
        <div className="wall-brick-big">{ itemComponents[2] }</div>
        <div className="wall-brick-medium">{ itemComponents[3] }</div>
        <div className="wall-brick-small">{ itemComponents[4] }</div>
      </div>
    );
  }
}

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    globalParams.mainComponent = this;
    this.state = {
      apiLoaded: false,
      itemsLoaded: false,
      items: null,
      offsetX: 0,
    };
    this.asyncLoadPlayLists = this.asyncLoadPlayLists.bind(this);
    this.startTrackMouse = this.startTrackMouse.bind(this);
    this.trackingMouse = this.trackingMouse.bind(this);
    this.endTrackMouse = this.endTrackMouse.bind(this);
  }
  render() {
    // const lists =
    const style = {
        transitioin: 'all 0.1s',
        marginLeft: `${this.state.offsetX}px`,
    };
    return (
      <div style={style} onMouseDown={this.startTrackMouse}
           onMouseMove={this.trackingMouse}
           onMouseUp={this.endTrackMouse} >{this.state.apiLoaded ? <Wall items={this.state.items} /> : null}</div>
    );
  }

  componentDidUpdate() {
    const self = this;
    if (this.state.apiLoaded && !this.state.itemsLoaded) {
      const request = gapi.client.youtube.activities.list({
        home: true,
        part: 'snippet',
        maxResults: 20
      });

      request.execute((response) => {
        self.asyncLoadPlayLists(response.items);
      });
    }
  }

  startTrackMouse() {
    this._trackMouse = true;
    this._startPointX = -1;
    this._baseOffsetX = this.state.offsetX;
  }

  endTrackMouse() {
    this._trackMouse = false;
    this._startPointX = -1;
  }

  trackingMouse(e) {
    if (this._trackMouse) {
        if (this._startPointX === -1) {
            this._startPointX = e.clientX;
            return;
        }
        let offsetX = this._baseOffsetX + e.clientX - this._startPointX;
        if (offsetX > 0) {
            offsetX = 0;
        }
        this.setState({
            offsetX,
        });
        // console.log(e.clientX, e.clientY);
    }
  }

  asyncLoadPlayLists(items) {
    const self = this;
    const playListLoaders = items.map((item, index) => {
      const channelId = item.snippet.channelId;
      const request = gapi.client.youtube.playlists.list({
        part: 'snippet',
        channelId,
        maxResults: 20
      });
      return function (callback) {
        request.execute((response) => {
          console.log('===', channelId, response);
          callback(null, response);
        });
      };
    });
    async.parallel(playListLoaders, (err, results) => {
      if (!err) {
        self.setState({
          itemsLoaded: true,
          items: self.concatVideos(results),
        })
      }
    });
  }

  concatVideos(results) {
    let videoList = [];
    results.forEach((result, index) => {
      videoList = videoList.concat(result.items);
    });
    return videoList;
  }

}

ReactDom.render(<MainComponent />, document.querySelector('#main'));
