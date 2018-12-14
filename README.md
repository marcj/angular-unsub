# Angular-unsub

Automatically unsubscribes your subscriptions of your components
when the component is destroyed.

## Example

## `unsubscribe()` decorator

Allows to collect multiple subscriptions in one collection to simplify code.

```typescript
@Component({
    template: 'Hi'
})
class MyComponent {
    @Input() data: Observable<any>;

    @unsubscribe()
    private sub: Subscription;

    constructor() {
        this.sub = this.data.subscribe((next) => {
        
        });
    }
}
```

## `Subscriptions` class

A decorator for class property, which automatically calls unsubscribe() on that property value
when the component is destroyed (when ngOnDestroy is called)

```typescript
@Component({
    template: 'Hi'
})
class MyComponent {
    @Input() data: Observable<any>;
    @Input() data2: Observable<any>;
        
    @unsubscribe()
    private subs = new Subscriptions();
    
    constructor() {
        this.sub.add = this.data.subscribe((next) => {
 
        });
 
        this.sub.add = this.data2.subscribe((next) => {
 
        });
    }
 }
 ```
 
 