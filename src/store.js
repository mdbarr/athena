function Store () {
  const self = this

  self.state = {
    loggedIn: false,
    name: 'Mark'
  }

  return self
}

export default new Store()
