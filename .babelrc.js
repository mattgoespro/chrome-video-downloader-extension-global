module.exports = (api) => {
  const isTest = api.env("test");

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current"
          }
        }
      ],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: [
      "@babel/plugin-transform-object-rest-spread",
      "@babel/plugin-transform-destructuring",
      "@babel/plugin-transform-class-properties",
      isTest && "babel-plugin-dynamic-import-node"
    ].filter(Boolean)
  };
};
