// A graph data structure with depth-first search and topological sort.
module.exports = function Graph(){
  
  // The adjacency list of the graph.
  // Keys are node ids.
  // Values are adjacent node id arrays.
  var edges = {};

  // Adds a node to the graph.
  // If node was already added, this function does nothing.
  // If node was not already added, this function sets up an empty adjacency list.
  function addNode(node){
    edges[node] = adjacent(node);
  }

  // Removes a node from the graph.
  // Also removes all of the node's incoming and outgoing edges.
  function removeNode(node){
    
    // Remove incoming edges.
    Object.keys(edges).forEach(function (u){
      edges[u].forEach(function (v){
        if(v === node){
          removeEdge(u, v);
        }
      });
    });

    // Remove outgoing edges (and signal that the node no longer exists).
    delete edges[node];
  }

  // Gets the list of nodes that have been added to the graph.
  function nodes(){
    var nodeSet = {};
    Object.keys(edges).forEach(function (u){
      nodeSet[u] = true;
      edges[u].forEach(function (v){
        nodeSet[v] = true;
      });
    });
    return Object.keys(nodeSet);
  }

  // Gets the adjacent node list for node u.
  // Returns an empty array for unknown nodes.
  function adjacent(u){
    return edges[u] || [];
  }

  // Adds an edge between nodes u and v.
  // Implicitly adds the nodes if they were not already added.
  function addEdge(u, v){
    addNode(u);
    addNode(v);
    adjacent(u).push(v);
  }

  // Removes the edge between nodes u and v.
  // Does not remove the nodes.
  // Does nothing if the edge does not exist.
  function removeEdge(u, v){
    if(edges[u]){
      edges[u] = adjacent(u).filter(function (_v){
        return _v !== v;
      });
    }
  }

  // Depth First Search algorithm, inspired by
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
  // This variant excludes the source nodes from the result.
  function depthFirstSearch(sourceNodes){

    var visited = {};
    var nodes = [];

    function DFSVisit(node){
      if(!visited[node]){
        visited[node] = true;
        adjacent(node).forEach(DFSVisit);
        nodes.push(node);
      }
    }

    sourceNodes.forEach(function (node){
      adjacent(node).forEach(DFSVisit);
    });

    return nodes;
  }

  // The topological sort algorithm yields a list of visited nodes
  // such that for each visited edge (u, v), u comes before v in the list.
  // Amazingly, this comes from just reversing the result from depth first search.
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
  function topologicalSort(sourceNodes){
    return depthFirstSearch(sourceNodes).reverse();
  }
  
  return {
    addNode: addNode,
    removeNode: removeNode,
    nodes: nodes,
    adjacent: adjacent,
    addEdge: addEdge,
    removeEdge: removeEdge,
    depthFirstSearch: depthFirstSearch,
    topologicalSort: topologicalSort
  };
}