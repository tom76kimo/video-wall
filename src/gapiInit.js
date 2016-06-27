const OAUTH2_CLIENT_ID = '208191556103-u0frivgcpr70vfpu287s32kjg4jtbgct.apps.googleusercontent.com';
const OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

const gapiInit = (globalParams) => {
  const checkAuth = () => {
    gapi.auth.authorize({
      client_id: OAUTH2_CLIENT_ID,
      scope: OAUTH2_SCOPES,
      immediate: true
    }, (authResult) => {
      if (authResult && !authResult.error) {
        loadYoutubeAPI();
      } else {
        api.auth.authorize({
          client_id: OAUTH2_CLIENT_ID,
          scope: OAUTH2_SCOPES,
          immdiate: false
        }, () => {
          loadYoutubeAPI();
        });
      }
    });
  };

  const loadYoutubeAPI = () => {
    gapi.client.load('youtube', 'v3', () => {
      globalParams.mainComponent.setState({
        apiLoaded: true,
      });
    });
  };

  window.handleClientLoad = function () {
    gapi.auth.init(() => {
      setTimeout(checkAuth, 1);
    });
  };
}

export default gapiInit;
