module.exports = {
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/gitlab\\.com\/.*/,
            handler: 'networkFirst',
        }
    ],
};