import * as restify from 'restify';

const server = restify.createServer({
    name: 'myFirstAPIwithTypeScript',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.get('/hello', (req, res, next) => {
    res.json({msg: 'Hello'});
    return next();
});

server.listen(8080, () => {
    console.log(`${server.name} está rodando em ${server.url}`);
})

