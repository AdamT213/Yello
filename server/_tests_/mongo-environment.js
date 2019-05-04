const NodeEnvironment = require("jest-environment-node");
const path = require("path");
const fs = require("fs");

const globalConfigPath = path.join(__dirname, "globalConfig.json");

console.log(globalConfigPath);

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    console.log("Setup MongoDB Test Environment");

    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, "utf-8"));

    this.global.MONGO_URI = globalConfig.mongoUri;
    this.global.MONGO_DB_NAME = globalConfig.mongoDBName;

    await super.setup();
  }

  async teardown() {
    console.log("Teardown MongoDB Test Environment");

    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;
