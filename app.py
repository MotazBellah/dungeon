from flask import Flask, render_template, jsonify, request, url_for
import random
from graph import Node, StackFrontier, QueueFrontier

app = Flask(__name__)
app.secret_key = 'super secret key'

# Create a cells
CELL = [i for i in range(100)]

# The home route
@app.route('/', methods=['GET', 'POST'])
def index():
    # Get random locations for player, door and monsters
    player, door, *monsters = random.sample(CELL, 16)
    # Render the index HTML with the variable player, door ,and monsters
    return render_template('index.html', player=player, door=door, monsters=monsters,  monsters1=monsters)

# Solve route accept only post request
# The outputs are list of cells and action to
# follow in order to reach to the door safely
@app.route('/solve', methods=['POST'])
def solve():
    # Get the location of player, door and list of monsters
    # Get the type of search
    player = request.form['player']
    door = request.form['door']
    type = request.form['type']
    monsters = request.form['monsters'].split(',')
    # Call short_path function to get the cells and moves
    short_path = shortest_path(player, door, monsters, type)
    # If path found,
    # Send a the coordinates and insructions in json formate
    if short_path:
        intructions = [i[0] for i in short_path]
        coordinates = [int(str(i[1][0]) + str(i[1][1])) for i in short_path]

        return jsonify({'intructions': intructions,
                        'coordinates': coordinates,
                        })

    return jsonify({'error': "There are no paths"})


def shortest_path(source, target, monster, search_type):
    '''
    Determine the shortest path between the source and target
    and avoid  the monsters
    Input: source(int), target(int), monsters(list of int), search_type(str)
    output: None or List of tuples of actions(moves) and cells
    '''
    # Convert the source to string in order to add `0`
    # if the source location in the top of the grid
    source = str(source)
    if len(source) == 1:
        source = '0' + source
    # Conver the string source to tuple of int
    row_src, col_src = tuple(source)
    x_src, y_src = int(row_src), int(col_src)

    # Convert the target to string in order to add `0`
    # if the source location in the top of the grid
    target = str(target)
    if len(target) == 1:
        target = '0' + target
    # Conver the string source to tuple of int
    row_trgt, col_trgt = tuple(target)
    x_trgt, y_trgt = int(row_trgt), int(col_trgt)

    # Create a first node to be the source
    start = Node(state=(x_src, y_src), parent=None, action=None)
    # Use DFS so, create a stackFrontier instance
    print('/////')
    print(search_type)
    if search_type == 'dfs':
        frontier = StackFrontier()
    else:
        # Use BFS so, create a QueueFrontier instance
        frontier = QueueFrontier()
    # Added the first node in the queue
    frontier.add(start)

    explored = set()

    # Create a loop to continue check the nodes
    # till the frontier is empty or reach to the target
    while True:
        # If frontier is empty, i.e we explored every node
        # and every neighbors of each node, but cannot reach to the target
        if frontier.empty():
            return None

        # Get the FIFO from the queue
        node = frontier.remove()
        # If the node is the target
        # Traverse the graph back to get all the nodes
        # return the actions(moves) and cell(coordinates)
        if node.state == (x_trgt, y_trgt):
            actions = []
            cells = []
            while node.parent is not None:
                actions.append(node.action)
                cells.append(node.state)
                node = node.parent
            actions.reverse()
            cells.reverse()
            return list(zip(actions, cells))

        # Add evey removed nod to the set
        explored.add(node.state)
        # Loop through the neighbors of the node's state (cell)
        # Get the actions(moves) and state(cells)
        # If they not in explored and not in the frontier, then
        # Create a child and update the frontier
        for action, state in neighbors(node.state, monster):
            if not frontier.contains_state(state) and state not in explored:
                # print(state)
                child = Node(state=state, parent=node, action=action)
                frontier.add(child)


def neighbors(state, monsters):
    '''
    Get the list of cells that neighbors to a cell
    but make sure the cells not in the monsters's cell
    Input: Cell as state (tuple of int), monsters (List of str numbers(cells))
    Output: Set of tuples of actions(moves) and cells in form (str, tuple)
    '''
    # Loop through the monsters's list
    # Convert each value to tuple and add it to the list
    monster_list = []
    for i in monsters:
        if len(i) == 1:
            i = '0' + i
        row_mons, col_mons = tuple(i)
        x_mons, y_mons = int(row_mons), int(col_mons)
        monster_list.append((x_mons, y_mons))
    # Unpack the state
    x, y = state
    # Define a candidates to be 4 up, down, left ,and right
    candidates = [
            ("left", (x, y - 1)),
            ("right", (x, y + 1)),
            ("up", (x - 1, y)),
            ("down", (x + 1, y)),
        ]
    neighbors_cells = set()
    # Loop through candidates
    # Get the action(move) and cell
    # If the cell not on the wall or the cell not in the monsters's cells
    for action, (r,c) in candidates:
        if 0 <= r <= 9 and 0 <= c <= 9 and (r, c) not in monster_list:
            neighbors_cells.add((action, (r,c)))

    return neighbors_cells


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
