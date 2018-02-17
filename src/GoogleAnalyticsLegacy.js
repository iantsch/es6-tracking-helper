import {logObject, error} from "./Utils.js";

export default class GoogleAnalyticsLegacy{
  constructor(options) {
    this.options = Object.assign(
      {
        debug: false,
        context: document,
        pageName: false,
        category: 'Global'
      },
      options
    );
  }
  static getName() { return 'GoogleAnalytics:_gaq'; }
  getName() { return GoogleAnalyticsLegacy.getName(); }
  pageview(options) {
    return [
      '_trackPageview',
      this.options.pageName ? `${this.options.pageName.replace(/(\/)+$/, '')}/${options.name.replace(/(\/)+$/, '')}` : options.name
    ]
  }
  event(options) {
    const trackingArray = [
      '_trackEvent',
      options.category ? options.category : this.options.category,
      options.name
    ];
    if (options.nonInteraction) {
      trackingArray.concat(['', 0, true]);
    }
    return trackingArray;
  }
  track(trackingArray) {
    try {
      if (typeof window._gaq === 'undefined') {
        if (this.options.debug) {
          error('_gaq object not found', this.getName());
        }
        return;
      }
      if (this.options.debug) {
        logObject (trackingArray, this.getName());
      }
      window._gaq.push(trackingArray)
    } catch (e) {
      if (this.options.debug) {
        error('Unkown error', this.getName());
      }
    }
  }
}
