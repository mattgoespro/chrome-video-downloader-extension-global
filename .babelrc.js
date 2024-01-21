module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }]
  ],
  plugins: [
    ["@babel/plugin-transform-class-properties"],
    [
      "@babel/plugin-transform-destructuring",
      {
        useBuiltIns: true
      }
    ],
    [
      "@babel/plugin-transform-object-rest-spread",
      {
        useBuiltIns: true
      }
    ],
    [
      // Polyfills the runtime needed for async/await and generators
      "@babel/plugin-transform-runtime",
      {
        helpers: false,
        regenerator: true
      }
    ]
  ]
};
