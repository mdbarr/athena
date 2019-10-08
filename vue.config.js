module.exports = {
  devServer: {
    host: '0.0.0.0',
    public: '0.0.0.0:8080',
    disableHostCheck: true,
    proxy: {
      '^/api': { target: 'http://localhost:6250' },
      '^/ws': {
        target: 'ws://localhost:6250',
        ws: true
      }
    }
  },
  filenameHashing: process.env.NODE_ENV !== 'production'
};
