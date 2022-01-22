export class Observer {
    update() {
        throw new Error('Not implemented');
    };
};

export class Subject {
    observers = [];

    subscribe(observer) {
        this.observers.push(observer);
    };

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    };

    notify(change) {
        this.observers.forEach(observer => observer.update(change));
    };
};
