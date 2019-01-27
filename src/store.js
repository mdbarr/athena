function Store() {
  const self = this;

  self.state = {
    drawer: true,
    isConnected: false,
    loading: false,
    loggedIn: false,
    name: 'Mark',
    terminals: []
  };

  return self;
}

export default new Store();
