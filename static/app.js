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
            var z = playerIndex.toString()
            // console.log(z);
            if (parseInt(z[1]) < 9 || (z.length == 1 && parseInt(z) < 9)) {
                squares[playerIndex].classList.remove('player')
                playerIndex += 1
            }
            console.log(playerIndex);
       }
       else if (e.keyCode === 38) {
           squares[playerIndex].classList.remove('player')
         // Press up arrow
         var corr = playerIndex.toString()

         if (corr.length > 1) {
             var y = parseInt(corr[0]) - 1
             var z =  y.toString() + corr[1]
             playerIndex = parseInt(z)
         }
         console.log(playerIndex);

       }
       else if (e.keyCode === 37) {
         // Press left
         var z = playerIndex.toString()
         if (parseInt(z[1]) > 0 || (z.length == 1 && parseInt(z) > 0)) {
             squares[playerIndex].classList.remove('player')
             playerIndex -= 1
         }
         console.log(playerIndex);
       }
       else if (e.keyCode === 40) {
           squares[playerIndex].classList.remove('player')
         // Press down
         var corr = playerIndex.toString()
         console.log(corr);
         if (parseInt(corr[0]) < 9 || (corr.length == 1 && parseInt(corr) <= 9)) {
            if (corr.length == 1) {
                var newCorr = '1' + corr
                playerIndex = parseInt(newCorr)
            } else {
                var y = parseInt(corr[0]) + 1
                var z = y.toString() + corr[1]
                playerIndex = parseInt(z)
             }
         }
         console.log(playerIndex);

       }

       squares[playerIndex].classList.add('player')

       // console.log(playerIndex);

   }

   document.addEventListener('keyup', control)



});
