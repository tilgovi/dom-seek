module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'chai', 'mocha', 'source-map-support'],
    files: [
      './node_modules/es6-promise/dist/es6-promise.js',
      'test.es6.js'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'test.es6.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: ['babelify', ['browserify-istanbul', {ignore: ['**/test*']}]]
    },
    coverageReporter: {
      reporters: [
        {type: 'lcovonly'},
        {type: 'text'}
      ]
    }
  });
};
