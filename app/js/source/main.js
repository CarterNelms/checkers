(function()
{
	'use strict';

	$(document).ready(initialize);

	function initialize()
	{
		wipeBoard();
	}

	function start()
	{
		setUpBoard();
		$('#board').on('click', '.playable', function(){alert('clicked');});
	}

	function setUpBoard()
	{
		// Set up the game board for a new game of checkers

		// Stop listening to the Start button
		$('#start').off('click');

		// Get all of the playable game spaces
		var $playableSpaces = $('.playable');
		// This for loop will set 2 checkers at once, one per player
		for(var i = 0; i < 12; ++i)
		{
			// Identify the next pieces to set, one per player
			var startingSpaces = [$($playableSpaces[i]),
														$($playableSpaces[$playableSpaces.length-1-i]),
			];
			// Set a checker in each of the locations to be set during this loop
			for(var j = 0; j < startingSpaces.length; ++j)
			{
				// Add a checker class to this piece
				var classToAdd = 'checker ';
				// If the piece belongs to player 2, add his class to it as well
				classToAdd += (!j) ? 'player2' : '';
				// Now set the class(es)
				startingSpaces[j].children('div').addClass(classToAdd);
			}
		}
	}

	function wipeBoard()
	{
		$('#start').click(start);
	}

})();