export default {
    testEnvironment: "node",
    setupFilesAfterEnv: ["./tests/setup.js"],
    coveragePathIgnorePatterns: ["/node_modules/"],
    transform: {},
    extensionsToTreatAsEsm: [".js"],
  };