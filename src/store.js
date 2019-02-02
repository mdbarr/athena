import constants from '../common/constants';

function Store() {
  const self = this;

  self.state = {
    drawer: true,
    panel: false,

    mode: constants.mode.focus,

    isConnected: false,
    loggedIn: false,
    name: 'Mark',

    loading: false,

    tree: {
      open: [ 'root' ]
    },

    terminals: []
  };

  return self;
}

export default new Store();
