import restify from "restify";
import * as usersModel from "./sequelize.mjs";
import DBG from "debug";
const log = DBG("users:model-users");

const PORT = process.env.PORT || 3000;

function respond(req, res, next) {
  res.send("hello1234 " + req.params.name);
  next();
}

const server = restify.createServer();
server.get("/hello/:name", respond);
server.head("/hello/:name", respond);

server.get("/list", async (req, res, next) => {
  res.send('just list')
  try {
    var res = await usersModel.justDBConnect();
    log('after db connect')
    res.send("in try");
    next(false)
  } catch (err) {
    log(err)
    res.send(err);
    next(false)
  }
});

server.listen(PORT, function() {
  console.log("%s listening at %s", server.name, server.url);
});
