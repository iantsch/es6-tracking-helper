import TrackingHelper from '../src/TrackingHelper.js';


test('Use built in trackers', () => {
  let i = 0;

  const trackingHelper = new TrackingHelper();

  expect(i).toEqual(0);

  trackingHelper.track({type:'event'});

  expect(i).toEqual(0);

  window.ga = () => { i +=1 };
  window._gaq = { push: () => {  i +=1 } };
  window.dataLayer = { push: () => { i +=1 } };
  trackingHelper.track({type:'event'});

  expect(i).toEqual(3);
});

test('Track with one tracker', () => {
  let i = 0;

  class OneTracker {
    event() {i += 2}
    track() {}
  }

  const trackingHelper = new TrackingHelper({
    availableTracker: {'mock': OneTracker}
  });

  expect(i).toEqual(0);

  trackingHelper.track({type:'event'});

  expect(i).toEqual(2);
});

test('Track with multiple trackers', () => {
  let i = 0;

  class MultiTracker {
    event() {i += 2}
    track() {}
  }

  const trackingHelper = new TrackingHelper({
    availableTracker: {'mock': MultiTracker, 'mock2': MultiTracker}
  });

  expect(i).toEqual(0);

  trackingHelper.track({type:'event'});

  expect(i).toEqual(4);
});

test('Adding and removing tracking types', () => {

  const trackingHelper = new TrackingHelper();

  expect(Object.keys(trackingHelper.types).length).toEqual(2);

  trackingHelper.add('custom');
  expect(Object.keys(trackingHelper.types).length).toEqual(3);
  trackingHelper.add('custom');
  expect(Object.keys(trackingHelper.types).length).toEqual(3);

  trackingHelper.remove('event');
  expect(Object.keys(trackingHelper.types).length).toEqual(2);
  trackingHelper.remove('event');
  expect(Object.keys(trackingHelper.types).length).toEqual(2);
});

test('Track with custom tracking type', () => {
  let i = 0;

  class CustomMethodTracker {
    custom() {i += 2}
    track() {}
  }

  const trackingHelper = new TrackingHelper({
    availableTracker: {'mock': CustomMethodTracker }
  });

  trackingHelper.add('custom');
  expect(i).toEqual(0);

  trackingHelper.track({type:'custom'});
  expect(i).toEqual(2);
});


test('Tracking type doesn\'t exist in Tracker', () => {
  let i = 0;

  class NonExistingMethodTracker {
    event() {i += 2}
    track() {}
  }

  const trackingHelper = new TrackingHelper({
    availableTracker: {'mock': NonExistingMethodTracker}
  });
  expect(i).toEqual(0);

  trackingHelper.track({type:'event'});
  expect(i).toEqual(2);

  trackingHelper.track({type:'pageview'});
  expect(i).toEqual(2);
});

test('Click triggers tracking, if data attributes are set', () => {
  let i = 0;

  class ListenOnClickTracker {
    event() {i += 2}
    track() {}
  }

  const trackingHelper = new TrackingHelper({
    availableTracker: {'mock': ListenOnClickTracker}
  });
  expect(i).toEqual(0);

  trackingHelper.onClick({target: {dataset: {trackingType: 'event'}}});
  expect(i).toEqual(2);

  trackingHelper.onClick();
  expect(i).toEqual(2);
});

test('Debugging enabled', () => {
  let i = 0;

  const consoleWarn = console.warn;
  console.log = () => i=1;
  console.warn = () => i=2;
  console.error = () => i=3;

  class DebuggingTracker {
    getName() {}
    track() {}
  }

  const trackingHelper = new TrackingHelper({
    debug: true,
    availableTracker: {'mock': DebuggingTracker}
  });
  expect(i).toEqual(1);

  trackingHelper.track({type:'event'});
  expect(i).toEqual(2);

  trackingHelper.track({type:'foo'});
  expect(i).toEqual(3);

  const defaultTrackingHelper = new TrackingHelper({debug: true, init: false});
  expect(i).toEqual(2);

  defaultTrackingHelper.startTracking();
  expect(i).toEqual(1);

  i = 0;
  defaultTrackingHelper.track({type:'event'});
  expect(i).toEqual(1);

  delete window.dataLayer;
  delete window.ga;
  delete window._gaq;

  defaultTrackingHelper.remove('foo');
  expect(i).toEqual(2);

  defaultTrackingHelper.track({type:'event'});
  expect(i).toEqual(3);

  defaultTrackingHelper.add('event');
  expect(i).toEqual(2);

  defaultTrackingHelper.stopTracking();
  expect(i).toEqual(1);

  window.ga = () => { foo.bar };
  window._gaq = { push: () => { foo.bar } };
  window.dataLayer = { push: () => { foo.bar } };

  defaultTrackingHelper.track({type:'event'});
  expect(i).toEqual(3);

});
