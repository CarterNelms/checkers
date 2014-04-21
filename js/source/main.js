(function()
{
	'use strict';

	var isJumpRequired;
	var isFirstMoveThisTurn;

	$(document).ready(initialize);

	function initialize()
	{
		listenForStart();
	}

	function start()
	{
		setUpBoard();
		prepMove();
		$('#board').on('click', '.playable .checker', selectPiece);
		$('#board').on('click', '.possibleMove', makeMove);
		// $('#change').click(changeTurns);
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
				classToAdd += (!j) ? 'player2' : 'currentPlayer selectable';
				// Now set the class(es)
				startingSpaces[j].append($('<div class="'+classToAdd+'">'));
				//startingSpaces[j].children('div').addClass(classToAdd);
			}
		}
	}

	function selectPiece()
	{
		if(isFirstMoveThisTurn)
		{
			var $checker = $(this);
			var isChecker = $checker.hasClass('checker');
			var isPlrChecker = isChecker && (isP1Turn() ^ $checker.hasClass('player2'));
			if(isPlrChecker)
			{
				deselect();
				$checker.addClass('selected');
				highlightPossibleMoves();
			}
		}
	}

	function highlightPossibleMoves()
	{
		$('.possibleMove').removeClass('possibleMove possibleJump');
		var moves = findPossibleMoves($('.selected'));
		moves[0].addClass('possibleMove');
		moves[1].addClass('possibleMove possibleJump');
	}

	function findPossibleMoves($checker)
	{
		var x = $checker.parent('td').data('x');
		var y = $checker.parent('td').data('y');

		/* This function will return an array of 2 arrays
		 * The first will contain all available moves
		 * The second will contain all available jumps
		 */
		var $moves = $([]);
		var $jumps = $([]);
debugger;
		for(var i = -1; Math.abs(i)===1; i+=2)
		{
			// Only check this row if it is in front of the piece or if the piece is a king
			var rowInFront = (isP1Turn()) ? -1 : 1;
debugger;
			if($checker.hasClass('king') || i === rowInFront)
			{
debugger;
				for(var j = -1; Math.abs(j)===1; j+=2)
				{
					var $square = $('td.square.playable[data-x='+(x+j)+'][data-y='+(y+i)+']');
					// If a square exists here...
debugger;
					if($square.length)
					{
						//... and if the square is empty...
debugger;
						if(!$square.children('.checker').length)
						{
							/*... and if the player did not just jump a piece
							 * and if the player is not required to make a jump
							 */
debugger;
							if(isFirstMoveThisTurn && !isJumpRequired)
							{
								//... then mark it as an available move
debugger;
								$moves = $moves.add($square);
								//$square.addClass('possibleMove');
							}
						}
						// Else, square exists but is occupied. Can it be jumped?
						else
						{
							var $nextSquareOver = $('td.square.playable[data-x='+(x+2*j)+'][data-y='+(y+2*i)+']');

							var isEnemyAdjacent = $square.children('.checker:not(.currentPlayer)').length;
							var isOtherSideOnBoard = $nextSquareOver.length;
							var isOtherSideEmpty = !$nextSquareOver.children('.checker').length;

							/* If the occupier is an enemy
							 * and the next square over exists
							 * and the next square over is empty...
							 */
							if(isEnemyAdjacent && isOtherSideOnBoard && isOtherSideEmpty)
							{
								//... then mark the next square over as a possible jump
								$jumps = $jumps.add($nextSquareOver);
								//$nextSquareOver.addClass('possibleMove possibleJump');
							}
						}
					}
				}
			}
		}
		return [$moves, $jumps];
	}

	function isMovingPossible()
	{
		return isActionPossible(false) || isActionPossible(true);
	}

	function isJumpingPossible()
	{
		return isActionPossible(true);
	}

	function isActionPossible(isCheckingJumps)
	{
		debugger;
		var moveTypeIndex = (isCheckingJumps) ? 1 : 0;

		var $pieces = (isFirstMoveThisTurn) ?
			$('.currentPlayer') :
				$('.selected');

		var isAtLeastOneMovePossible = false;
		// This check will run once for moves, and 
		$pieces.each(function(index)
		{
			var $currentPiece = $($pieces.get(index));
			var moveCount = findPossibleMoves($currentPiece)[moveTypeIndex].length;
			if(moveCount > 0)
			{
				isAtLeastOneMovePossible = true;
				return;
			}
		});
		debugger;

		// If no move was found, then return 
		return isAtLeastOneMovePossible;		
	}

	function makeMove()
	{
		var $checker = $('.selected');
		var $oldLocation = $checker.parent();
		var $newLocation = $(this);
		$newLocation.append($checker);

		unhighlightPossibleMoves();

		// Check to see if the piece needs to become a king
		var kingRow = (isP1Turn()) ? 0 : Math.sqrt($('.square').length)-1;
		var isKinged = !$checker.hasClass('king') && $newLocation.data('y') === kingRow;
		if(isKinged)
		{
			$checker.addClass('king');
		}

		// Check to see if a piece was jumped. If so, remove that piece.
		var x1 = $oldLocation.data('x');
		var x2 = $newLocation.data('x');
		var isJump = (Math.abs(x1 - x2) === 2);
		if(isJump)
		{
			var x = ($oldLocation.data('x') + $newLocation.data('x'))/2;
			var y = ($oldLocation.data('y') + $newLocation.data('y'))/2;
			$('.square[data-x='+x+'][data-y='+y+'] .checker').remove();
		}

		/* If a jump was made
		 * and the player was not kinged
		 * and another jump is possible
		 * then check for more jumps.
		 */
		//isKinged = false; // This line is inserted to allow jump-chaining after being kinged. Comment out to revert
		// Since the turn isn't changing, the next turn won't be the first
			debugger;
		isFirstMoveThisTurn = false;
		if(isJump && !isKinged && isJumpingPossible())
		{
			$('.currentPlayer:not(.selected)').removeClass('selectable');
			highlightPossibleMoves();
		}
		// Otherwise, change turns
		else
		{
			isFirstMoveThisTurn = true;
			changeTurns();
		}
	}

	function isWin()
	{
			debugger;
		if(!isMovingPossible())// && isFirstMoveThisTurn)
		{
			debugger;
			gameOver();
			return true;
		}
		return false;
		// var P1CheckersLeft = $('.checker:not(.player2)').length;
		// var P2CheckersLeft = $('.checker.player2').length;
		// if(P1CheckersLeft <= 0 || P2CheckersLeft <= 0)
		// {
		// 	if(P1CheckersLeft <= 0)
		// 	{
		// 		alert('Player 2 wins!');
		// 	}
		// 	else
		// 	{
		// 		alert('Player 1 wins!');
		// 	}
		// 	listenForStart();
		// 	return true;
		// }
		// return false;
	}

	function listenForStart()
	{
		$('#start').click(start);
		$('#board').off('click');
		$('#change').off('click');
	}

	function deselect()
	{
		unhighlightPossibleMoves();
		$('.selected').removeClass('selected');
	}

	function unhighlightPossibleMoves()
	{
		$('.possibleMove').removeClass('possibleMove possibleJump');
	}

	function changeTurns()
	{
		var $currentPlayer = $('.checker.currentPlayer');
		var $nextPlayer = $('.checker:not(.currentPlayer)');

		$currentPlayer.removeClass('currentPlayer selectable');
		$nextPlayer.addClass('currentPlayer selectable');

		prepMove();
	}

	function isP1Turn()
	{
		var isP2Turn = $('.currentPlayer.player2').length;
		if(isP2Turn)
		{
			return false;
		}
		return true;
	}

	function prepMove()
	{
		deselect();
		isFirstMoveThisTurn = true;
		isJumpRequired = (isJumpingPossible()) ? true : false;
		if(!isWin())
		{			
				// var player = (isP1Turn()) ? 'Player 1' : 'Player 2';
				// alert(player + ', you must take the jump');
			display();
		}
	}

	function display()
	{
		var text;
		var player = (isP1Turn()) ? 'Player 1' : 'Player 2';
		// if(!isWin())
		// {
		text = player + '\'s turn\n';
		text += (isJumpRequired) ? 'Take the jump' : 'Fire away';
		$('#display').text(text);
		// }
		// else
		// {
		// 	text = player + ' wins!!';
		// }
	}

	function gameOver()
	{
		var winner = (isP1Turn()) ? 'Player 1' : 'Player 2';
		var text = winner + ' wins!!';
		$('#display').text(text);
		alert(text);
	}

})();