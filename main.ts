import { Server } from './server/server'

new Server().bootstrap().then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(err => {
    console.log('Server failed to start');
    console.error(err);
    process.exit(1);
});
