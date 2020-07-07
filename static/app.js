document.addEventListener('DOMContentLoaded', () => {
    // Get the squares
    const squares = document.querySelectorAll('.grid div');
    const startBtn = document.querySelector('.start');
    // Get the location of the player, door and monster
    let playerIndex = player
    squares[playerIndex].classList.add('player')
    squares[door].classList.add('door')
    squares[monster].classList.add('monster')


   function control(e) {

       if (e.keyCode === 39) {
           squares[playerIndex].classList.remove('player')
           playerIndex += 1
       }
       else if (e.keyCode === 38) {
           squares[playerIndex].classList.remove('player')
         // Press up arrow
         var corr = playerIndex.toString()
         var y = corr[0] - 1
         var z =  y + corr[1]
         console.log(z);
         playerIndex = parseInt(z)
       }
       else if (e.keyCode === 37) {
           squares[playerIndex].classList.remove('player')
         // Press left
         playerIndex -= 1
       }
       else if (e.keyCode === 40) {
           squares[playerIndex].classList.remove('player')
         // Press down
         var corr = playerIndex.toString()
         var y = parseInt(corr[0]) + 1
         var z = y.toString() + corr[1]
         playerIndex = parseInt(z)
       }

       squares[playerIndex].classList.add('player')

       console.log(playerIndex);

   }

   document.addEventListener('keyup', control)



});
