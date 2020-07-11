document.addEventListener('DOMContentLoaded', () => {
    // Get the squares, startBtand BFS
    const squares = document.querySelectorAll('.grid div');
    const startBtn = document.querySelector('.start');
    const bfs = document.querySelector('.bfs');
    const searchDiv = document.querySelector('.search-type');
    // Declare the gameFinished boolean vairable
    let gameFinished = false
    // Get the location of the player, door
    // Add the class to display the images
    let playerIndex = player
    squares[playerIndex].classList.add('player')
    squares[door].classList.add('door')
    // Loop through the monsters list and add the class
    // display the monster and fire traps
    for (let i = 0; i < monsters.length; i++) {
        if (i % 2 == 0) {
            squares[monsters[i]].classList.add('monster')
        } else {
            squares[monsters[i]].classList.add('fire')
        }
    }

    // Create a control function that handle the play movement
   function control(e) {
       // If the game not finished accept the new value
       if (gameFinished === false) {
           if (e.keyCode === 39) {
               // Press light arrow
                var z = playerIndex.toString()
                squares[playerIndex].classList.remove('player')
                if (parseInt(z[1]) < 9 || (z.length == 1 && parseInt(z) < 9)) {
                    playerIndex = parseInt(playerIndex) + 1
                }
           }
           else if (e.keyCode === 38) {
             // Press up arrow
             squares[playerIndex].classList.remove('player')
             var corr = playerIndex.toString()
             if (corr.length > 1) {
                 var y = parseInt(corr[0]) - 1
                 var z =  y.toString() + corr[1]
                 playerIndex = parseInt(z)
             }

           }
           else if (e.keyCode === 37) {
             // Press left
             var z = playerIndex.toString()
             if (parseInt(z[1]) > 0 || (z.length == 1 && parseInt(z) > 0)) {
                 squares[playerIndex].classList.remove('player')
                 playerIndex -= 1
             }
           }
           else if (e.keyCode === 40) {
               // Press down
             squares[playerIndex].classList.remove('player')
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

           }

           // Update the location of the player
           if ( squares[playerIndex]) {
               squares[playerIndex].classList.add('player')
           }
           // Check if the player in the monster/fire then player lose
           // Set the gameFinished to be true
           if (monsters.includes(playerIndex)) {
               alert('You Lose')
               gameFinished = true
           }
           // Check if the player reach to the door then player win
           // Set the gameFinished to be true
           if (playerIndex == door) {
               alert('You Win')
               gameFinished = true
           }
       }

       // Call hide_display function to hide/visible the monsters/fire and
       // player and the door based on the game status
       hide_display(gameFinished)

   }

   // Once the user use the arrows call the control
    document.addEventListener('keyup', control)

   // Reload the game, once click on start/restart button
   startBtn.addEventListener('click', function() {
       gameFinished = true
       $.ajax({
            type: 'get',
            url: '/' ,
            data: {
            },
            success: function(response) {
                window.location.href = '/'
            }
        });
   });

   // Hide/visible the images based on the game status
   function hide_display(status) {
       // Get all monsters and fire
       let monsters = document.querySelectorAll('.monster')
       let fires = document.querySelectorAll('.fire')

       if (status === false) {
           // Hide all the images but the player in case the status is false
           document.querySelector('.door').style.visibility = 'hidden';

           for (let i = 0; i < monsters.length; i++) {
                   monsters[i].style.visibility = 'hidden'
                   fires[i].style.visibility = 'hidden'
               }

       } else {
           // display all the images in case the status is false
           document.querySelector('.door').style.visibility  = 'visible';

           for (let i = 0; i < monsters.length; i++) {
                   monsters[i].style.visibility = 'visible'
                   fires[i].style.visibility = 'visible'
               }
       }
   }
   // Let the user get some idea about the loactions of the monsters/fire and door
   // Hide them all again once the player is moved
   document.querySelector('.show').addEventListener('click', function () {
       var display_all = true
       hide_display(display_all)
   })

   // Handle search type
   searchDiv.addEventListener('click', function (event) {
       // Make the default type to be BFS
       let searchType = 'bfs'
       if (event.target.id == 'dfs') {
           searchType = 'dfs'
       }

        // Get all green cells(path)
        let solutions = document.querySelectorAll('.solve');
        // Remove the green cells from the grid
         if (solutions.length) {
            for (let i = 0; i < solutions.length; i++) {
                solutions[i].classList.remove('solve')
            }
        }

     // Reset the area of instruction
      document.querySelector('.action').innerHTML = ''
      // Send post request to solve route to find the path
      // Send the playerIndex and door and monsters as a data to the route
      // If the request success, get the response and parse it to get the data
       $.ajax({
           type: 'post',
           url: '/solve' ,
           data: {
               player: playerIndex,
               door: door,
               monsters: monsters.toString(),
               type: searchType,

           },
           success: function(response) {;
               if ('error' in response) {
                   alert(response['error'])
               } else {
                   // Get the coordinates
                   // Loop through it and add solve class,
                   // so it would appear as a green path on the grid
                   const cells = response['coordinates']
                   for (let i = 0; i < cells.length; i++) {
                       let index = cells[i]
                       squares[index].classList.add('solve')
                   }
                   // Get the action area
                   const actionDiv = document.querySelector('.action')
                   const p = document.createElement('p')
                   p.innerHTML = "Follow the following path to reach to the door:"
                   // Get the moves from the response
                   // Loop through it and append it to the pragraph element
                   const pAction = document.createElement('p')
                   const actions = response['intructions']
                   for (var i = 0; i < actions.length; i++) {
                       if (i == actions.length - 1 ) {
                           pAction.innerHTML += actions[i]
                       } else {
                           pAction.innerHTML += actions[i] + ' --> '
                       }

                   }
                   // Append to the parant to display them to the user
                   actionDiv.appendChild(p)
                   actionDiv.appendChild(pAction)

               }
           }
       });

       hide_display(true)
       // console.log();
   })

   hide_display(gameFinished)

});
