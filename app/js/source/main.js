(function()
{
	'use strict';

	var isP1Turn;
	// var isJumpRequired = false;
	// var isJumpDetected;

	$(document).ready(initialize);

	function initialize()
	{
		/* end() runs at the end of each game, but also preps
		the board for a new game, so it will work here as well.
		*/
		end();
	}

	function start()
	{
		//$('#board').off('click');
		setUpBoard();
		isP1Turn = true;
		$('#board').on('click', '.playable .checker', selectPiece);
		$('#board').on('click', '.possibleMove', makeMove);
	}

	function setUpBoard()
	{
		// Set up the game board for a new game of checkers

		// Stop listening to the Start button
		$('#start').off('click');

		$('.checker').remove();

		// Get all of the playable game spaces
		var $playableSpaces = $('.playable');
		var $div = $('<div>');
		$div.addClass('checker');
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
				startingSpaces[j].append($('<div class="'+classToAdd+'">'));
				//startingSpaces[j].children('div').addClass(classToAdd);
			}
		}
	}

	function selectPiece()
	{
		var $checker = $(this);
		var isChecker = $checker.hasClass('checker');
		var isPlrChecker = isChecker && (isP1Turn ^ $checker.hasClass('player2'));
		if(isPlrChecker)
		{
			deselect();
			$checker.addClass('selected');
			findPossibleMoves();
		}
	}

	function findPossibleMoves()
	{
		$('.possibleMove').removeClass('possibleMove possibleJump');
		var $checker = $('.selected');
		var x = $checker.parent('td').data('x');
		var y = $checker.parent('td').data('y');

		for(var i = -1; Math.abs(i)===1; i+=2)
		{
			// Only check this row if it is in front of the piece or if the piece is a king
			var rowInFront = (isP1Turn) ? -1 : 1;
			if($checker.hasClass('king') || i === rowInFront)
			{
				for(var j = -1; Math.abs(j)===1; j+=2)
				{
					x=x;
					y=y;
					var $square = $('td.square.playable[data-x='+(x+j)+'][data-y='+(y+i)+']');
					var $nextSquareOver = $('td.square.playable[data-x='+(x+2*j)+'][data-y='+(y+2*i)+']');
					// If a square exists here...
					if($square.length)
					{
						// If the square is empty...
						if(!$square.children('.checker').length)
						{
							//... then mark it as an available move
							$square.addClass('possibleMove');
						}
						// Else, square is occupied.
						// If the occupier is an enemy and the next square over is exmpy...
						else if($square.children('.checker:not(.currentPlayer)').length && !$nextSquareOver.children('.checker').length)
						{
							$nextSquareOver.addClass('possibleMove possibleJump');
						}
					}
				}
			}
		}
	}

	function makeMove()
	{
		var $checker = $('.selected');
		var $oldLocation = $checker.parent();
		var $newLocation = $(this);
		$newLocation.append($checker);

		deselect();

		// Check to see if the piece needs to become a king
		var kingRow = (isP1Turn) ? 0 : Math.sqrt($('.square').length)-1;
		if(!$checker.hasClass('king') && $newLocation.data('y') === kingRow)
		{
			$checker.addClass('king');
		}

		// Check to see if a piece was jumped. If so, remove that piece.
		var x1 = $oldLocation.data('x');
		var x2 = $newLocation.data('x');
		if(Math.abs(x1 - x2) === 2)
		{
			var x = ($oldLocation.data('x') + $newLocation.data('x'))/2;
			var y = ($oldLocation.data('y') + $newLocation.data('y'))/2;
			$('.square[data-x='+x+'][data-y='+y+'] .checker').remove();
		}

		var P1CheckersLeft = $('.checker:not(.player2)').length;
		var P2CheckersLeft = $('.checker.player2').length;
		if(P1CheckersLeft <= 0)
		{
			alert('Player 2 wins!');
			end();
		}
		else if(P2CheckersLeft <= 0)
		{
			alert('Player 1 wins!');
			end();
		}
		else
		{
			changeTurns();
		}
	}

	function end()
	{
		$('#start').click(start);
		$('#board').off('click');
	}

	function deselect()
	{
		$('.possibleMove').removeClass('possibleMove possibleJump');
		$('.selected').removeClass('selected');
	}

	function changeTurns()
	{

		var $currentPlayer = $('.currentPlayer');
		var $nextPlayer = $(':not(.currentPlayer)');

		$currentPlayer.removeClass('currentPlayer');
		$nextPlayer.addClass('currentPlayer');

		isP1Turn = !isP1Turn;
	}

})();