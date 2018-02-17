import {logObject, error} from "./Utils.js";

export default class GoogleAnalytics{
  constructor(options) {
    this.options = Object.assign(
      {
        debug: false,
        context: document,
        pageName: false,
        category: 'Global',
        action: 'Global'
      },
      options
    );
  }
  static getClassName() { return 'GoogleAnalytics'; }
  getClassName() { return GoogleAnalytics.getClassName(); }
  getPageView(options) {
    return [
      'send',
      'pageview',
      this.options.pageName ? `${this.options.pageName.replace(/(\/)+$/, '')}/${options.name.replace(/(\/)+$/, '')}` : options.name
    ];
  }
  getEvent(options) {
    return [
      'send',
      'event',
      options.category ? options.category : this.options.category,
      options.action ? options.action : this.options.action,
      options.name,
      { nonInteraction : options.nonInteraction ? 1 : 0 }
    ];
  }
  track(trackingArray) {
    try {
      if (typeof window.ga === 'undefined') {
        if (this.options.debug) {
          error('ga object not found', 'GoogleAnalytics:ga');
        }
        return;
      }
      if (this.options.debug) {
        logObject(trackingArray, 'GoogleAnalytics:ga');
      }
      window.ga(...trackingArray);
    } catch (e) {
      if (this.options.debug) {
        error('Unkown error', 'GoogleAnalytics:ga');
      }
    }
  }
}
