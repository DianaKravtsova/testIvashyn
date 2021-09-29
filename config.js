class Config {
    get server() {
        return {
            port: process.env.PORT || 3000,
            secret: 'fe1a5485a5366tre5894b84d77664679',
            expiresIn: 18000000000,
            appURL: process.env.APP_URL || 'http://localhost:3000'
        };
    }

    get postgres() {
        return {
            username: process.env.PG_USERNAME || 'postgres',
            password: process.env.PG_PASSWORD || 'postgres',
            host: process.env.PG_HOST || 'localhost',
            database: process.env.PG_DATABASE || 'testTask',
            port: process.env.PG_PORT || 5432
        };
    }
}

module.exports = new Config();