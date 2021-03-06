import Sequelize from "sequelize";
import fs from "fs-extra";
import DBG from "debug";
const log = DBG("notes:model-notes");
const error = DBG("notes:error");

var SQNote;
var sequlz;

async function connectDB() {
  if (SQNote) return SQNote.sync();
  const params = await fs.readJSON('./sequelizeSettings.json');
  log(params)

  // db に接続したインスタンスがない場合は接続してインスタンスを作る
  if (!sequlz)
    sequlz = new Sequelize(
      params.dbname,
      params.username,
      params.password,
      params.params
    );

  // These fields largely come from the Passport / Portable Contacts schema.
  // See http://www.passportjs.org/docs/profile
  //
  // The emails and photos fields are arrays in Portable Contacts.  We'd need to set up
  // additional tables for those.
  //
  // The Portable Contacts "id" field maps to the "username" field here
  if (!SQNote)
    SQNote = sequlz.define("Note", {
      name: { type: Sequelize.STRING, unique: true },
      description: Sequelize.STRING
    });
  return SQNote.sync();
}

export async function create(name, description) {
  const SQNote = await connectDB();
  return SQNote.create({
    name,
    description
  });
}

export async function update(
  username,
  password,
  provider,
  familyName,
  givenName,
  middleName,
  emails,
  photos
) {
  const user = await find(username);
  return user
    ? user.updateAttributes({
        password: password,
        provider: provider,
        familyName: familyName,
        givenName: givenName,
        middleName: middleName,
        emails: JSON.stringify(emails),
        photos: JSON.stringify(photos)
      })
    : undefined;
}

export async function destroy(username) {
  const SQUser = await connectDB();
  const user = await SQUser.find({ where: { username: username } });
  if (!user)
    throw new Error("Did not find requested " + username + " to delete");
  user.destroy();
}

export async function find(username) {
  log("find  " + username);
  const SQUser = await connectDB();
  const user = await SQUser.find({ where: { username: username } });
  const ret = user ? sanitizedUser(user) : undefined;
  // log(`find returning ${util.inspect(ret)}`);
  return ret;
}

export async function userPasswordCheck(username, password) {
  const SQUser = await connectDB();
  const user = await SQUser.find({ where: { username: username } });
  log(
    "userPasswordCheck query= " +
      username +
      " " +
      password +
      " user= " +
      user.username +
      " " +
      user.password
  );
  if (!user) {
    return { check: false, username: username, message: "Could not find user" };
  } else if (user.username === username && user.password === password) {
    return { check: true, username: user.username };
  } else {
    return { check: false, username: username, message: "Incorrect password" };
  }
}

export async function findOrCreate(profile) {
  const user = await find(profile.id);
  if (user) return user;
  return await create(
    profile.id,
    profile.password,
    profile.provider,
    profile.familyName,
    profile.givenName,
    profile.middleName,
    profile.emails,
    profile.photos
  );
}

export async function listNotes() {
  const SQNote = await connectDB();
  const notes = await SQNote.findAll({});
  return notes;
}

export function sanitizedUser(user) {
  // log(util.inspect(user));
  var ret = {
    id: user.username,
    username: user.username,
    provider: user.provider,
    familyName: user.familyName,
    givenName: user.givenName,
    middleName: user.middleName,
    emails: JSON.parse(user.emails),
    photos: JSON.parse(user.photos)
  };
  try {
    ret.emails = JSON.parse(user.emails);
  } catch (e) {
    ret.emails = [];
  }
  try {
    ret.photos = JSON.parse(user.photos);
  } catch (e) {
    ret.photos = [];
  }
  return ret;
}
