module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: [
      'fixture',
      'browserify',
      'chai',
      'mocha',
      'source-map-support'
    ],
    files: [
      'test/*.spec.es6.js',
      'test/fixtures/*.html'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'test/*.spec.es6.js': ['browserify'],
      'test/fixtures/*.html': ['html2js']
    },
    browserify: {
      debug: true,
      transform: ['babelify', 'browserify-istanbul']
    },
    coverageReporter: {
      reporters: [
        {type: 'lcovonly'},
        {type: 'text'}
      ]
    }
  });
};
