To create a Node.js application with singleton patterns defined in separate JavaScript files and used in a `main.js` file, you can follow these steps:

### 1. Define the Singletons
Each singleton should be a self-contained module that exports a single instance.

#### Example: `singletonA.js`
```javascript
class SingletonA {
    constructor() {
        if (SingletonA.instance) {
            return SingletonA.instance;
        }
        this.value = "This is Singleton A";
        SingletonA.instance = this;
    }

    getValue() {
        return this.value;
    }
}

module.exports = new SingletonA();
```

#### Example: `singletonB.js`
```javascript
class SingletonB {
    constructor() {
        if (SingletonB.instance) {
            return SingletonB.instance;
        }
        this.counter = 0;
        SingletonB.instance = this;
    }

    increment() {
        this.counter += 1;
        return this.counter;
    }

    getCounter() {
        return this.counter;
    }
}

module.exports = new SingletonB();
```

### 2. Use the Singletons in `main.js`
Import the singletons and interact with them as needed.

#### Example: `main.js`
```javascript
const singletonA = require('./singletonA');
const singletonB = require('./singletonB');

console.log(singletonA.getValue()); // Output: This is Singleton A

console.log(singletonB.getCounter()); // Output: 0
console.log(singletonB.increment()); // Output: 1
console.log(singletonB.increment()); // Output: 2
console.log(singletonB.getCounter()); // Output: 2

// Demonstrating that the singleton is the same instance
const anotherReferenceToB = require('./singletonB');
console.log(anotherReferenceToB.getCounter()); // Output: 2 (same instance)
```

### 3. Run the Application
Save the files in the same directory and run the `main.js` file using Node.js:

```bash
node main.js
```

### Key Points
1. **Singleton Pattern**: The `if (SingletonX.instance)` check ensures that only one instance of the class exists.
2. **Exporting the Instance**: Using `module.exports = new SingletonX()` exports the single instance.
3. **Consistency**: All `require` calls for the same file will return the same instance due to Node.js's module caching.

This approach ensures that your application follows the singleton pattern effectively while keeping the code modular and organized.
