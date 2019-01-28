function Store() {
  const self = this;

  self.state = {
    drawer: true,
    panel: false,

    isConnected: false,
    loggedIn: false,
    name: 'Mark',

    loading: false,

    terminals: []
  };

  return self;
}

export default new Store();
