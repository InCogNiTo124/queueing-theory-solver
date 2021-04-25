console.log("Graph");

const graphContainer = document.getElementById("graph");

// data
const nodes = new vis.DataSet([
  {
    id: 0,
    color: {
      background: "white",
      border: "white",
      highlight: "white",
    },
    title: "start",
  },
  {
    id: -1,
    color: {
      background: "white",
      border: "white",
      highlight: "white",
    },
    title: "end",
  },
]);

const edges = new vis.DataSet([]);

// network
let data = {
  nodes: nodes,
  edges: edges,
};
let options = {
  edges: {
    arrows: "to",
    color: "black",
  },
  nodes: {
    shape: "circle",
    color: "lightgrey",
    size: 10,
  },
  manipulation: {
    addNode: async (node, callback) => {
      // tooltip hover
      document.getElementById("note").textContent = `New node. Enter id:`;
      node.title = await enterValue();

      // value label
      document.getElementById(
        "note"
      ).textContent = `Node ${node.title}. Enter value:`;
      node.label = await enterValue();

      // colouring
      document.getElementById(
        "note"
      ).textContent = `Is the node first or last? (first|last|none)`;
      const position = await enterValue();
      if (position === "first") {
        node.color = "cadetblue";
      } else if (position === "last") {
        node.color = "slateblue";
      }
      
      //done
      callback(node);
    },
    editNode: async (node, callback) => {
      document.getElementById(
        "note"
      ).textContent = `Editing node ${node.title} (${node.label}). Enter new value:`;
      const value = await enterValue();
      node.label = value;
      callback(node);
    },
    editEdge: async (edge, callback) => {
      document.getElementById(
        "note"
      ).textContent = `Editing edge from ${edge.from} to ${edge.to}. Enter new value:`;
      const value = await enterValue();
      edge.label = value;
      callback(edge);
    },
    addEdge: async (edge, callback) => {
      const fromNode = nodes._data.get(edge.from);
      const toNode = nodes._data.get(edge.to);
      document.getElementById(
        "note"
      ).textContent = `New edge from ${fromNode.title} (${fromNode.label}) to ${toNode.title} (${toNode.label}). Enter edge value:`;
      const value = await enterValue();
      edge.label = value;
      callback(edge);
    },
  },
};
let network = new vis.Network(graphContainer, data, options);

function enterValue() {
  return new Promise((resolve) => {
    let value = "";
    document.addEventListener("keydown", onKeyHandler);
    function onKeyHandler(e) {
      console.log(e);
      if (e.key === "Enter") {
        document.removeEventListener("keydown", onKeyHandler);
        document.getElementById("typed-text").textContent = "";
        document.getElementById("note").textContent = "Waiting for action...";
        resolve(value);
      } else {
        if (e.key === "Backspace") {
          value = value.slice(0, value.length - 1);
        } else {
          value += e.key;
        }
        document.getElementById("typed-text").textContent = value;
      }
    }
  });
}
