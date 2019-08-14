export const environment = {
    server: {
        port: process.env.SERVER_PORT || 8080
    },
    db: {
        uri: process.env. DB_URI || 'mongodb://localhost/peaky-blinders'
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10
    }
}