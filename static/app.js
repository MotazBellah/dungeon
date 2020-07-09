document.addEventListener('DOMContentLoaded', () => {
    // Get the squares

    const squares = document.querySelectorAll('.grid div');
    const startBtn = document.querySelector('.start');
    const bfs = document.querySelector('.bfs');
    // Get the location of the player, door and monster
    let playerIndex = player
    squares[playerIndex].classList.add('player')
    squares[door].classList.add('door')

    for (let i = 0; i < monsters.length; i++) {
        if (i % 2 == 0) {
            squares[monsters[i]].classList.add('monster')
        } else {
            squares[monsters[i]].classList.add('fire')
        }
    }


   function control(e) {

       if (e.keyCode === 39) {
            var z = playerIndex.toString()
            // console.log(squares[playerIndex]);
            // console.log(z);
            squares[playerIndex].classList.remove('player')
            if (parseInt(z[1]) < 9 || (z.length == 1 && parseInt(z) < 9)) {

                playerIndex = parseInt(playerIndex) + 1
            }
            // console.log(playerIndex);
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
         // console.log(playerIndex);

       }
       else if (e.keyCode === 37) {
         // Press left
         var z = playerIndex.toString()
         if (parseInt(z[1]) > 0 || (z.length == 1 && parseInt(z) > 0)) {
             squares[playerIndex].classList.remove('player')
             playerIndex -= 1
         }
         // console.log(playerIndex);
       }
       else if (e.keyCode === 40) {
           squares[playerIndex].classList.remove('player')
         // Press down
         var corr = playerIndex.toString()
         // console.log(corr);
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
         // console.log(playerIndex);

       }

       if ( squares[playerIndex]) {
           squares[playerIndex].classList.add('player')
       }

       // console.log(playerIndex);

   }

   document.addEventListener('keyup', control)

   bfs.addEventListener('click', function() {
       let solutions = document.querySelectorAll('.solve');
       console.log(solutions);

       if (solutions.length) {
           for (let i = 0; i < solutions.length; i++) {
               solutions[i].classList.remove('solve')
           }
       }

       $.ajax({
            type: 'post',
            url: '/solve' ,
            data: {
                player: playerIndex,
                door: door,
                monsters: monsters.toString(),

            },
            success: function(response) {
                console.log(response['intructions']);
                console.log(response['coordinates']);
                if ('error' in response) {
                    alert(response['error'])
                } else {
                    const cells = response['coordinates']
                    for (let i = 0; i < cells.length; i++) {
                        let index = cells[i]
                        squares[index].classList.add('solve')
                    }
                }
            }
        });
   });

});
