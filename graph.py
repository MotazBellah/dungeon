# Create node class that represent the vertices of the graph
class Node():
    def __init__(self, state, parent, action):
        self.state = state
        self.parent = parent
        self.action = action

# Create a stack DS to be able to make DFS
class StackFrontier():
    # Init the empty list
    def __init__(self):
        self.frontier = []

    # Add new node to the list
    def add(self, node):
        self.frontier.append(node)

    # Check if any explored nodes are in the stack already
    def contains_state(self, state):
        return any(node.state == state for node in self.frontier)

    # Check if the stack is empty
    def empty(self):
        return len(self.frontier) == 0

    # Remove one element from the stack and update the stack
    # LIFO
    def remove(self):
        if self.empty():
            raise Exception("empty frontier")
        else:
            node = self.frontier.pop()
            return node

# Create a queue DS to be able to make BFS
class QueueFrontier(StackFrontier):
    # Inhrite all functions of the stack DS but the remove function
    # Override the remove function to remove as a queue FIFO
    def remove(self):
        if self.empty():
            raise Exception("empty frontier")
        else:
            node = self.frontier.pop(0)
            return node
