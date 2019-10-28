import restify from "restify";

const PORT = process.env.PORT || 3000;

function respond(req, res, next) {
  res.send("hello1234 " + req.params.name);
  next();
}

const server = restify.createServer();
server.get("/hello/:name", respond);
server.head("/hello/:name", respond);

server.listen(PORT, function() {
  console.log("%s listening at %s", server.name, server.url);
});
