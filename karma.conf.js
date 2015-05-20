module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'chai', 'mocha', 'source-map-support'],
    files: [
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
