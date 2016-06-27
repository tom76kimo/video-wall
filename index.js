import React from 'react';
import ReactDom from 'react-dom';
import GapiInit from './src/gapiInit';

let globalParams = {};

GapiInit(globalParams);

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    globalParams.mainComponent = this;
    this.state = {
      apiLoaded: false
    };
  }
  render() {
    return (
      <div>{this.state.apiLoaded ? 'API loaded' : 'nononono'}</div>
    );
  }
}

ReactDom.render(<MainComponent />, document.querySelector('#main'));
