from flask import Flask, render_template
import random
from graph import StackFrontier, QueueFrontier

app = Flask(__name__)
app.secret_key = 'super secret key'

# Create a cells
CELLS = [i for i in range(100)]

@app.route('/')
def index():
    # Get random locations for player, door and monster
    player, door, monster = random.sample(CELLS, 3)
    return render_template('index.html', player=player, door=door, monster=monster)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
