import React from 'react';
import ReactDom from 'react-dom';
import GapiInit from './src/gapiInit';
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
    const items = this.props.items;
    const itemComponents = items.map((item, index) => {
      const thumbnails = item.snippet.thumbnails;
      const imgSrc = thumbnails.maxres ? thumbnails.maxres.url : thumbnails.medium.url;
      return (
          <img width="640" key={index} className="wall-brick" src={imgSrc} />
      );
    });
    return (
      <div>{itemComponents}</div>
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
    };
    this.asyncLoadData = this.asyncLoadData.bind(this);
  }
  render() {
    // const lists =

    return (
      <div>{this.state.apiLoaded ? <Wall items={this.state.items} /> : null}</div>
    );
  }

  componentDidUpdate() {
    const self = this;
    if (this.state.apiLoaded && !this.state.itemsLoaded) {
      const request = gapi.client.youtube.activities.list({
        home: true,
        part: 'snippet',
        maxResults: 5
      });

      request.execute((response) => {
        console.log('===', response);
        self.asyncLoadData(response.items[1].snippet.channelId);
        // self.setState({
        //   items: response.items,
        //   itemsLoaded: true,
        // });
      });
    }
  }

  asyncLoadData(channelId) {
    // async.parallel([
    //   function (callback) {

    //   }
    // ]);
    const self = this;
    const request = gapi.client.youtube.playlists.list({
      part: 'snippet',
      channelId: channelId,
      maxResults: 20
    });

    request.execute((response) => {
      console.log('===channels', response);
      self.setState({
        items: response.items,
        itemsLoaded: true,
      });
    })
  }

}

ReactDom.render(<MainComponent />, document.querySelector('#main'));
