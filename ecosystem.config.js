module.exports = {
  apps: [
    {
      name: 'server',
      script: 'npm',
      args: 'run start',
      env: {
        PORT: 8082
      }
    },
    {
      name: 'web-socket',
      script: 'npm',
      args: 'run web-socket',
      env: {
        PORT: 8083
      }
    }
  ]
};
