module.exports = {
  ...require("build-configs/jest.config"),
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
