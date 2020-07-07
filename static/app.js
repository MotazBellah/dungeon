document.addEventListener('DOMContentLoaded', () => {
    // Get the squares
    const squares = document.querySelectorAll('.grid div');
    const startBtn = document.querySelector('.start');

    // Get the location of the player, door and monster
    function getLocations() {
    squares[player].classList.add('player')
    squares[door].classList.add('door')
    squares[monster].classList.add('monster')
   }

getLocations()

});
