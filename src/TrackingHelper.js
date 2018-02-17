import {log, warn, error} from "./Utils.js";
import GoogleAnalyticsLegacy from "./GoogleAnalyticsLegacy.js";
import GoogleAnalytics from "./GoogleAnalytics.js";
import GoogleTagManager from "./GoogleTagManager.js";

export const Tracker = {
  GoogleAnalyticsLegacy: GoogleAnalyticsLegacy,
  GoogleAnalytics: GoogleAnalytics,
  GoogleTagManager: GoogleTagManager
};

export default class TrackingHelper{
  /**
   * Create a new instance of a client side router
   * @param {object} options - Tracking helper options
   * @param {boolean} [options.debug=false] - Enables debugging in the console
   * @param {boolean} [options.init=true] - Initiate click event listener
   * @param {Node} [options.context=document] - Context for event listener
   * @param {object} [options.availableTracker=Tracker] - Tracker Classes
   * @param {string|boolean} [options.pageName=false] - Will be prepended to event/pageview names in built in tracker
   * @param {string} [options.category=Global] - Global Category
   * @param {string} [options.action=Global] - Global Action
   * @param {object} [options.dataset] - Data attributes for event listener
   * @param {string} [options.dataset.type=trackingType] - Data attributes for event listener
   * @param {string} [options.dataset.category=trackingCategory] - Data attributes for event listener
   * @param {string} [options.dataset.action=trackingAction] - Data attributes for event listener
   * @param {string} [options.dataset.name=trackingName] - Data attributes for event listener
   * @param {string} [options.dataset.nonInteraction=trackingNonInteraction] - Data attributes for event listener
   */
  constructor(options) {
    this.options = Object.assign(
      {
        debug: false,
        init: true,
        context: document,
        availableTracker: Tracker,
        pageName: false,
        category: 'Global',
        action: 'Global',
        dataset:  {
          type: 'trackingType',
          category: 'trackingCategory',
          action: 'trackingAction',
          name: 'trackingName',
          nonInteraction: 'trackingNonInteraction'
        }
      },
      options
    );
    this.tracker = [];
    this.isTracking = false;
    this.types = [
      'event',
      'pageview'
    ];

    let {context, availableTracker, tracker, dataset, ...trackerOptions} = this.options;
    Object.keys(this.options.availableTracker).map(key => {
      if (this.options.debug) {
        log(`Enabled Tracker: ${key}`);
      }
      this.tracker.push(new this.options.availableTracker[key](trackerOptions));
    });

    this.onClick = this.onClick.bind(this);
    if (this.options.init) {
      this.startTracking();
    } else if (this.options.debug) {
      warn('Tracking by data attributes is not enabled');
    }
  }

  /**
   * @returns {TrackingHelper} - This tracking helper instance
   */
  startTracking() {
    if (!this.isTracking) {
      if (this.options.debug) {
        log('Start tracking');
      }
      (this.options.context || document).addEventListener('click', this.onClick);
      this.isTracking = true;
    }
    return this;
  }

  /**
   * @returns {TrackingHelper} - This tracking helper instance
   */
  stopTracking() {
    if (this.isTracking) {
      log('Stop tracking');
      (this.options.context || document).removeEventListener('click', this.onClick);
      this.isTracking = false;
    }
    return this;
  }

  /**
   * @param {object} event - event object
   * @param {Node} event.target - event target
   * @returns {TrackingHelper} - This tracking helper instance
   */
  onClick(event) {
    let node = event.target;

    if (!node.dataset[this.options.dataset.type]) {
      return;
    }

    const options = {
      type: node.dataset[this.options.dataset.type],
      category: node.dataset[this.options.dataset.category],
      action: node.dataset[this.options.dataset.action],
      name: node.dataset[this.options.dataset.name],
      nonInteraction: node.dataset[this.options.dataset.nonInteraction]
    };

    this.track(options);
  }

  /**
   * @param {string} type - tracking type/method name
   * @returns {TrackingHelper} - This tracking helper instance
   */
  add(type) {
    if (this.types.indexOf(type) > -1) {
      if (this.options.debug) {
        warn(`Tracking type ${type} already exists.`);
      }
    } else {
      this.types.push(type);
    }
    return this;
  }

  /**
   * @param {string} type - tracking type/method name
   * @returns {TrackingHelper} - This tracking helper instance
   */
  remove(type) {
    if (this.types.indexOf(type) < 0) {
      if (this.options.debug) {
        warn(`Cannot remove tracking type ${type}.`);
      }
    } else {
      this.types = this.types.filter(t => t !== type);
    }
    return this;
  }

  /**
   * @param {object} options - relevant tracking information
   * @param {string} options.type - tracking type
   * @param {string} options.name - tracking name
   * @param {string} options.category - tracking category
   * @param {string} options.action - tracking action
   * @param {string} options.nonInteraction - tracking non interaction flag
   * @returns {TrackingHelper} - This tracking helper instance
   */
  track(options) {
    if (this.types.indexOf(options.type) < 0) {
      if (this.options.debug) {
        error(`Tracking type ${options.type} not registered. Add with this.add(type)`);
      }
      return this;
    }
    this.tracker.map(tracker => {
      if (options.type in tracker) {
        let trackingData = tracker[options.type](options);
        tracker.track(trackingData);
      } else if (this.options.debug) {
        warn(`Tracking type ${options.type} in ${tracker.getClassName()} not available`);
      }
    });
    return this;
  }

}
