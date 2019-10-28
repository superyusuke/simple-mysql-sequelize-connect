import restify from "restify";
import * as usersModel from "./sequelize.mjs";
import DBG from "debug";
const log = DBG("users:model-users");

const PORT = process.env.PORT || 3000;

const server = restify.createServer();

// url parameter を req.query にパースしてくれる
// /test?id=12 => req.query.id
server.use(restify.plugins.queryParser());
// リクエストの body をパースしてくれるっぽい
server.use(
  restify.plugins.bodyParser({
    mapParams: true
  })
);

server.get("/test", (req, res, next) => {
  res.send(req.query);
  next();
});

server.get("/create/:name", async (req, res, next) => {
  const name = req.query.name;
  log(name);
  const createdNote = await usersModel.create(name, "this is test");
  res.send(createdNote);
  next();
});

server.get("/list", async (req, res, next) => {
  try {
    const notes = await usersModel.listNotes();
    res.send(notes);
    next(false);
  } catch (err) {
    log(err)
    res.send("error");
    next(false);
  }
});

server.listen(PORT, function() {
  console.log("%s listening at %s", server.name, server.url);
});
