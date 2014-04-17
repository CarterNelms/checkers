(function()
{
	'use strict';

	var isP1turn;

	$(document).ready(initialize);

	function initialize()
	{
		wipeBoard();
	}

	function start()
	{
		setUpBoard();
		isP1turn = true;
		$('#board').on('click', '.playable div', selectPiece);
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
				classToAdd += (!j) ? 'player2' : 'currentPlayer';
				// Now set the class(es)
				startingSpaces[j].children('div').addClass(classToAdd);
			}
		}
	}

	function selectPiece()
	{
		var $checker = $(this);
		// If there is a checker here...
		if($checker.hasClass('checker'))
		{
			//... then check to see if it is th current player's
			var isPlrChecker = (isP1turn) ?
				!$checker.hasClass('player2') :
					$checker.hasClass('player2');
			isPlrChecker = isPlrChecker;
		}
	}

	function wipeBoard()
	{
		$('#start').click(start);
	}

})();