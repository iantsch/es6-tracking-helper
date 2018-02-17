import {logObject, error} from "./Utils.js";

export default class GoogleTagManager {
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
  static getClassName() { return 'GoogleTagManager'; }
  getClassName() { return GoogleTagManager.getClassName(); }
  getPageView(options) {
    return {
      event: 'Virtual Pageview',
      pageNameVirtual: this.options.pageName ? `${this.options.pageName.replace(/(\/)+$/, '')}/${options.name.replace(/(\/)+$/, '')}` : options.name,
      virtualPath: options.action || this.options.action
    }
  }
  getEvent(options) {
    return {
      event: 'ga_event',
      eventCategory: options.category || this.options.category,
      eventAction: options.action || this.options.action,
      eventLabel: options.name,
      eventNonInteraction: options.nonInteraction ? true : false
    }
  }
  track(trackingObject) {
    try {
      if (typeof window.dataLayer === 'undefined') {
        if (this.options.debug) {
          error('window.dataLayer object not found', 'GoogleTagManager');
        }
        return;
      }
      if (this.options.debug) {
        logObject(trackingObject, 'GoogleTagManager');
      }
      window.dataLayer.push(trackingObject);
    } catch (e) {
      if (this.options.debug) {
        error('Unkown error', 'GoogleTagManager');
      }
    }
  }
}
