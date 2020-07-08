from flask import Flask, render_template
import random
from graph import Node, StackFrontier, QueueFrontier

app = Flask(__name__)
app.secret_key = 'super secret key'

# Create a cells
CELL = [i for i in range(100)]

@app.route('/')
def index():
    # Get random locations for player, door and monster
    player, door, monster = random.sample(CELL, 3)
    print(shortest_path(player, door, monster))
    return render_template('index.html', player=player, door=door, monster=monster)


def shortest_path(source, target, monster):

    source = str(source)
    if len(source) == 1:
        source = '0' + source

    row_src, col_src = tuple(source)
    x_src, y_src = int(row_src), int(col_src)

    target = str(target)
    if len(target) == 1:
        target = '0' + target

    row_trgt, col_trgt = tuple(target)
    x_trgt, y_trgt = int(row_trgt), int(col_trgt)

    start = Node(state=(x_src, y_src), parent=None, action=None)
    frontier = QueueFrontier()
    frontier.add(start)

    explored = set()

    while True:
        if frontier.empty():
            return None

        node = frontier.remove()

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


        explored.add(node.state)

        for action, state in neighbors(node.state, monster):
            if not frontier.contains_state(state) and state not in explored:
                child = Node(state=state, parent=node, action=action)
                frontier.add(child)


def neighbors(state, monster):
    monster = str(monster)
    if len(monster) == 1:
        monster = '0' + monster

    row_mons, col_mons = tuple(monster)
    x_mons, y_mons = int(row_mons), int(col_mons)

    # state = str(state)
    # if len(state) == 1:
    #     state = '0' + state
    # print(state)
    # row, col = tuple(state)
    # x, y = int(row), int(col)
    x, y = state

    candidates = [
            ("left", (x, y - 1)),
            ("right", (x, y + 1)),
            ("up", (x - 1, y)),
            ("down", (x + 1, y)),
        ]
    neighbors_cells = set()

    for action, (r,c) in candidates:
        if 0 <= r < 9 and 0 <= c < 9 and (r, c) != (x_mons, y_mons):
            neighbors_cells.add((action, (r,c)))

    return neighbors_cells


if __name__ == '__main__':
    # print(neighbors(44))
    # print(neighbors(5))
    app.run(debug=True, host='0.0.0.0')
