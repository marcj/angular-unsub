import {Subscription, Observable} from "rxjs";

function lazyInitialize(target: any) {
    if (target.__observableValues) {
        return;
    }

    Object.defineProperty(target, '__observableValues', {
        enumerable: false,
        configurable: false,
        value: {}
    });
}

/**
 * Allows to collect multiple subscriptions in one collection to simplify code.
 *
 * @example
 *
 * @Component({
 *  template: 'Hi'
 * })
 * class MyComponent {
 *     @unsubscribe()
 *     private subs = new Subscriptions();
 *
 *     ngOnChanges() {
 *         this.sub.add = this.data.subscribe((next) => {
 *
 *         });
 *
 *         this.sub.add = this.data2.subscribe((next) => {
 *
 *         });
 *     }
 * }
 */
export class Subscriptions {
    protected subscription: Subscription[] = [];

    public subscribe<T>(observable: Observable<T>, callback: (next: T) => any) {
        this.subscription.push(observable.subscribe(callback));
    }

    public set add(v: Subscription) {
        this.subscription.push(v);
    }

    public unsubscribe() {
        for (const sub of this.subscription) {
            sub.unsubscribe();
        }

        this.subscription = [];
    }
}

/**
 * A decorator for class property, which automatically calls unsubscribe() on that property value
 * when the component is destroyed (when ngOnDestroy is called).
 *
 * @example
 *
 * @Component({
 *  template: 'Hi'
 * })
 * class MyComponent {
 *     @unsubscribe()
 *     private sub: Subscription;
 *
 *     ngOnChanges() {
 *         this.sub = this.data.subscribe((next) => {
 *
 *         });
 *     }
 * }
 *
 */
export function unsubscribe() {
    return function (target: Object, propertyKey: string | symbol) {
        const constructor = target.constructor;

        const state: { value?: Subscription | Subscriptions } = {};

        function unsub() {
            if (state.value instanceof Subscription) {
                state.value.unsubscribe();
            }

            if (state.value instanceof Subscriptions) {
                state.value.unsubscribe();
            }
        }

        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            configurable: true,
            get() {
                return this.__observableValues[propertyKey];
            },

            set(value) {
                lazyInitialize(this);
                unsub();
                this.__observableValues[propertyKey] = value;
                state.value = value;
            }
        });

        const ngOnDestroy = constructor.prototype.ngOnDestroy;

        constructor.prototype.ngOnDestroy = function (...args: any[]) {
            unsub();
            delete state.value;

            ngOnDestroy && ngOnDestroy.apply(this, args);
        };
    };
}