module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.1.30:8888/api/private/v1/',
                pathRewrite: {
                    '^/api': ''
                },
            }
        }
    }
}