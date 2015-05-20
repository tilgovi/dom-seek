import {default as seek} from '../index.es6'


describe('seek', function () {
  before(function(){
    fixture.setBase('test/fixtures')
  });

  beforeEach(function () {
    fixture.load('test.html');
  });

  afterEach(function () {
    fixture.cleanup();
  });

  it('is a function', function () {
    assert.isFunction(seek)
  });
});
