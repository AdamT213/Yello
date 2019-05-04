module.exports = async () => {
  await global.MONGOD.stop();
};
