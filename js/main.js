let s = new sigma({
  container: 'graph-container',
  settings: {
    maxNodeSize: 16,
    minNodeSize: 45,
    minEdgeSize: 5,
    maxEdgeSize: 5,
    minArrowSize: 25
  },
})

let nodes = [
  {
    "id": "n0",
    "label": "Whitefield",
    "x": 0,
    "y": 0,
    "size": 3,
    "color": "#f00"
  },
  {
    "id": "n1",
    "label": "Indiranager",
    "x": 1,
    "y": 2,
    "size": 7,
    "color": "#0f0"
  },
  {
    "id": "n2",
    "label": "Bellandur",
    "x": 2,
    "y": 0,
    "size": 5,
    "color": "#00f"
  },
  {
    "id": "n3",
    "label": "Koramangala",
    "x": 3,
    "y": 4,
    "size": 3,
    "color": "#f0f"
  },
  {
    "id": "n4",
    "label": "Kudanhalli",
    "x": 4,
    "y": 5,
    "size": 2,
    "color": "#ff0"
  },
  {
    "id": "n5",
    "label": "ITPL",
    "x": 5,
    "y": 2,
    "size": 6,
    "color": "#0ff"
  }
]

let edges = [
  {
    id: 'e0',
    source: 'n0',
    target: 'n1',
    size: 5,
    color: '#C0C0C0'    
  },
  {
    id: 'e1',
    source: 'n0',
    target: 'n2',
    size: 5,    
    color: '#C0C0C0'
  },
  {
    id: 'e2',
    source: 'n5',
    target: 'n1',
    size: 5,
    color: '#C0C0C0'
  },
  {
    id: 'e3',
    source: 'n2',
    target: 'n1',
    size: 5,
    color: '#C0C0C0'
  },
  {
    id: 'e4',
    source: 'n2',
    target: 'n5',
    size: 5,
    color: '#C0C0C0'
  },
  {
    id: 'e5',
    source: 'n5',
    target: 'n3',
    size: 5,
    color: '#C0C0C0'
  },
  {
    id: 'e6',
    source: 'n1',
    target: 'n3',
    size: 5,
    color: '#C0C0C0'
  },
  {
    id: 'e7',
    source: 'n4',
    target: 'n3',
    size: 5,
    color: '#C0C0C0'
  },
  {
    id: 'e8',
    source: 'n4',
    target: 'n5',
    size: 5,
    color: '#C0C0C0'
  },
]

// Then, let's add some data to display:
nodes.forEach((node) => {
  s.graph.addNode(node);
});
edges.forEach((edge) => {
  s.graph.addEdge(edge);
});
s.refresh();

function randomize() {
  nodes = nodes.map((node) => {
    node.size = Math.ceil(Math.random() * 10);
    return node;
  });
  nodes.forEach((node) => {
    s.graph.dropNode(node.id);
    s.graph.addNode(node);
  });
  edges.forEach((edge) => {    
    s.graph.addEdge(edge);
  });
  s.refresh();
}

let highPivot = 7;
let lowPivot = 3;

function optimize() {  
  let highDemandNodes = nodes.filter((node) => node.size <= lowPivot);
  highDemandNodes.sort((a, b) => a.size - b.size)  
  let processedNodes = [];
  highDemandNodes.forEach((node) => {
    let neighbours = s.graph.neighborhood(node.id);  
    let edges = neighbours.edges;  
    neighbours.nodes.forEach((n) => {
      if(!n.center && n.size >= highPivot && processedNodes.indexOf(n.id) == -1) {        
        // processedNodes.push(n.id);        
        let edge = findEdge(edges, n , node);                        
        s.graph.dropEdge(edge.id);
        let newEdge = {
          id: edge.id,
          source: n.id,
          target: node.id,
          size: edge.size,
          type: 'arrow',
        }
        s.graph.addEdge(newEdge);        
        processedNodes.push({
          from: n.label,
          to: node.label,
        });
      }
    })    
  });
  s.refresh();
  return processedNodes;
}

function findEdge(edges, from, to){
  return edges.find((e) => {
    return ((e.source === from.id && e.target === to.id) || (e.source === to.id && e.target === from.id));
  });
}


const m = document.querySelector('.status');
const logs = document.querySelector('.message .logs');

// function evalLoop() {
//   m.textContent = 'Status: Creating new demand...';
//   setTimeout(() => {
//     randomize();
//     m.textContent = 'Status: Finding free rides to meet demand...';
//     setTimeout(() => {
//       let processed = optimize();
//       let date = new Date();
//       let el;           
//       if(processed.length === 0) {
//         m.textContent = 'Failed to meet demand';  

//         el = document.createElement('div');
//         el.textContent = date;
//         el.style.marginTop = '20px';
//         logs.appendChild(el);        

//         el = document.createElement('div');
//         el.textContent = '– Unable to meet demand due to constraints. Or there wasn\'t enough demand for the algo to kick in';        
//         logs.appendChild(el);
//       } else {
//         m.textContent = 'Demand met succesfully'        

//         el = document.createElement('div');
//         el.textContent = date;
//         el.style.marginTop = '20px';
//         logs.appendChild(el);

//         processed.forEach((p) => {
//           el = document.createElement('div');
//           el.textContent = `– Gave free ride from ${p.from} to ${p.to}.`;
//           logs.appendChild(el);
//         });
//       }          
//     }, 2000);
//   }, 2000);
// }

function evalLoop() {
  m.textContent = 'Status: Creating new demand...';
  setTimeout(() => {
    randomize();
    m.textContent = 'Status: Finding free rides to meet demand...';
    setTimeout(() => {
      let processed = optimize();
      let date = new Date();
      let el;
      let rootLog = document.createElement('div');
      
      if(processed.length === 0) {
        m.textContent = 'Failed to meet demand';  

        el = document.createElement('div');
        el.textContent = date;
        el.style.marginTop = '20px';
        rootLog.appendChild(el);        

        el = document.createElement('div');
        el.textContent = '– Unable to meet demand due to constraints. Or there wasn\'t enough demand for the algo to kick in';        
        rootLog.appendChild(el);
      } else {
        m.textContent = 'Demand met succesfully'        

        el = document.createElement('div');
        el.textContent = date;
        el.style.marginTop = '20px';
        rootLog.appendChild(el);

        processed.forEach((p) => {
          el = document.createElement('div');
          el.textContent = `– Gave free ride from ${p.from} to ${p.to}.`;
          rootLog.appendChild(el);
        });
      }
      logs.insertBefore(rootLog, logs.children[1]);
    }, 2000);
  }, 2000);
}

// correct zoom level
s.cameras[0].goTo({ x: 0, y: 0, angle: 0, ratio: 1.2 });

setInterval(evalLoop, 5000);