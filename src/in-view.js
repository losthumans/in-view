import Registry from './registry';
import { inViewport } from './viewport';
import { throttle } from 'lodash';

/**
* Create and return the inView function.
*/
const inView = () => {

    /**
    * Fallback if window is undefined.
    */
    if (typeof window === 'undefined') return;

    /**
    * How often and on what events we should check
    * each registry.
    */
    const interval = 100;
    const triggers = ['scroll', 'resize', 'load'];

    /**
    * Maintain a list of all registries and a default options object.
    */
    const register = [];
    const options  = { offset: { top: 0, right: 0, bottom: 0, left: 0 }, threshold: 0, test: inViewport };

    /**
    * Check each registry from selector history,
    * throttled to interval.
    */
    const check = throttle(() => {
        register.forEach(registry => {
            registry.check();
        });
    }, interval);

    /**
    * For each trigger event on window, add a listener
    * which checks each registry.
    */
    triggers.forEach(event =>
        addEventListener(event, check));

    /**
    * If supported, use MutationObserver to watch the
    * DOM and run checks on mutation.
    */
    if (MutationObserver) {
        addEventListener('DOMContentLoaded', () => {
            new MutationObserver(check)
                .observe(document.body, { attributes: true, childList: true, subtree: true });
        });
    }

    /**
    * The main interface. Take a selector string, or list
    * of nodes and return a new registry.
    */
    const control = (selection) => {
        const registry = Registry(getElements(selection), options);
        register.push(registry);
        return registry;
    };

    /**
    * Add proxy for test function, set defaults,
    * and return the interface.
    */
    control.is = el => options.test(el, options);
    return control;

};

function getElements(obj) {
    if (typeof obj === 'string')
        return [].slice.call(document.querySelectorAll(obj));
    if ([NodeList, HTMLCollection].some(collection => obj instanceof collection))
        return [].slice.call(obj);
    if (obj.nodeType)
        return [obj];
    throw new TypeError('Expected a selector string or list of nodes.');
}

// Export a singleton.
export default inView();
