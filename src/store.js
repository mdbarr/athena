function Store() {
  const self = this;

  self.state = {
    drawer: false,
    isConnected: false,
    loggedIn: false,
    name: 'Mark',
    terminals: []
  };

  return self;
}

export default new Store();
