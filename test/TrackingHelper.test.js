import TrackingHelper from '../src/TrackingHelper.js';


test('Use built in trackers', () => {
  let i = 0;

  window.ga = () => { i +=1 };
  window._gaq = { push: () => {  i +=1 } };
  window.dataLayer = { push: () => { i +=1 } };

  const trackingHelper = new TrackingHelper();

  expect(i).toEqual(0);

  trackingHelper.track({type:'event'});

  expect(i).toEqual(3);
});

test('Track with one tracker', () => {
  let i = 0;

  class OneTracker {
    event() {
      i += 2
    }
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
    event() {
      i += 2
    }
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

  trackingHelper.remove('event');

  expect(Object.keys(trackingHelper.types).length).toEqual(2);
});

test('Track with custom tracking type', () => {
  let i = 0;

  class CustomMethodTracker {
    custom() {
      i += 2
    }
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
    event() {
      i += 2
    }
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
