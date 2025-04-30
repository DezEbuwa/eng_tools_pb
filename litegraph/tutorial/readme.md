Absolutely! Here's a beginner-friendly tutorial to help you get started with **LiteGraph.js**, a JavaScript library for creating node-based graphs, often used in visual programming, AI systems, shader editors, and more.

---

## 🧠 LiteGraph.js Beginner Tutorial

### 🔧 Prerequisites

To follow along, you should have:
- Basic HTML and JavaScript knowledge
- A modern browser
- A local server or [CodePen](https://codepen.io/), [JSFiddle](https://jsfiddle.net/), or similar platform

---

## ✅ Step 1: Set Up Your HTML Page

Create an HTML file and include LiteGraph.js:

```html
<!DOCTYPE html>
<html>
<head>
  <title>LiteGraph Tutorial</title>
  <script src="https://cdn.jsdelivr.net/npm/litegraph.js@0.8.2/build/litegraph.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/litegraph.js@0.8.2/css/litegraph.css">
  <style>
    body { margin: 0; overflow: hidden; }
    #graphCanvas { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="graphCanvas"></canvas>
  <script src="script.js"></script>
</body>
</html>
```

---

## ✅ Step 2: Create the Graph (script.js)

Create `script.js` in the same directory and paste the following:

```javascript
// Create graph
const graph = new LGraph();

// Create canvas
const canvas = new LGraphCanvas("#graphCanvas", graph);

// Create a basic node
const node = LiteGraph.createNode("basic/const");
node.pos = [200, 200];
node.setValue(42); // Set output value
graph.add(node);

// Add a Watch node
const watchNode = LiteGraph.createNode("basic/watch");
watchNode.pos = [400, 200];
graph.add(watchNode);

// Connect the nodes
node.connect(0, watchNode, 0);

// Start the graph
graph.start();
```

---

## ✅ Step 3: Learn the Basics

### ✨ Node Types:
LiteGraph comes with built-in node types like:
- `basic/const` – outputs a constant value
- `basic/watch` – displays the incoming value

You can also create **custom nodes**.

---

## ✅ Step 4: Create Your First Custom Node

Add this to `script.js`:

```javascript
function MyCustomAddNode() {
  this.addInput("A", "number");
  this.addInput("B", "number");
  this.addOutput("Sum", "number");
  this.properties = { A: 0, B: 0 };
}

MyCustomAddNode.title = "Add";
MyCustomAddNode.desc = "Adds two numbers";

MyCustomAddNode.prototype.onExecute = function() {
  const A = this.getInputData(0) || 0;
  const B = this.getInputData(1) || 0;
  this.setOutputData(0, A + B);
};

LiteGraph.registerNodeType("math/add", MyCustomAddNode);
```

Now you’ll see a new node under `math/add`.

---

## 🧪 Experiment Ideas

- Chain nodes together to build a mini calculator
- Build a custom node to display alerts
- Load/save graphs using `graph.serialize()` and `graph.configure(data)`

---

## 📚 Next Steps

- [LiteGraph.js GitHub Repo](https://github.com/jagenjo/litegraph.js)
- Look into `canvas.onNodeSelected` to trigger actions on node click
- Explore advanced examples like audio graphs or shader editors

---

Would you like a follow-up with exercises or a specific project to build using LiteGraph.js?
