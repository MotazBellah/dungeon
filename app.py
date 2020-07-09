from flask import Flask, render_template, jsonify, request, url_for
import random
from graph import Node, StackFrontier, QueueFrontier

app = Flask(__name__)
app.secret_key = 'super secret key'

# Create a cells
CELL = [i for i in range(100)]

@app.route('/')
def index():
    # Get random locations for player, door and monster
    player, door, *monsters = random.sample(CELL, 14)

    return render_template('index.html', player=player, door=door, monsters=monsters,  monsters1=monsters)


@app.route('/solve', methods=['POST'])
def solve():
    player = request.form['player']
    door = request.form['door']
    monsters = request.form['monsters'].split(',')
    # print('/////////////////')
    # print(monsters.split(','))
    # print(type(monsters.split(',')))

    short_path = shortest_path(player, door, monsters)
    if short_path:
        intructions = [i[0] for i in short_path]
        coordinates = [int(str(i[1][0]) + str(i[1][1])) for i in short_path]
        # print(shortest_path(player, door, monster))
        # print(intructions)
        # print(coordinates)
        return jsonify({'intructions': intructions,
                        'coordinates': coordinates,
                        })

    return jsonify({'error': "There are no paths"})


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

    # print(x_trgt, y_trgt)
    # print(x_src, y_src)

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
                # print(state)
                child = Node(state=state, parent=node, action=action)
                frontier.add(child)


def neighbors(state, monsters):
    monster_list = []
    for i in monsters:
        if len(i) == 1:
            i = '0' + i
        row_mons, col_mons = tuple(i)
        x_mons, y_mons = int(row_mons), int(col_mons)
        monster_list.append((x_mons, y_mons))

    # print(monster_list)

    x, y = state

    candidates = [
            ("left", (x, y - 1)),
            ("right", (x, y + 1)),
            ("up", (x - 1, y)),
            ("down", (x + 1, y)),
        ]
    neighbors_cells = set()
    # print(x_mons, y_mons)
    # print(state)
    for action, (r,c) in candidates:
        if 0 <= r <= 9 and 0 <= c <= 9 and (r, c) not in monster_list:
            neighbors_cells.add((action, (r,c)))

    return neighbors_cells


if __name__ == '__main__':
    # print(neighbors(44))
    # print(neighbors(5))
    app.run(debug=True, host='0.0.0.0')
