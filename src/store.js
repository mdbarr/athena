function Store () {
  const self = this

  self.state = {
    isConnected: false,
    loggedIn: false,
    name: 'Mark'
  }

  return self
}

export default new Store()
