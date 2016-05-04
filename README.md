--A simple game I created--

You see a number of blocks. Each block has a color and it has a border that can have another color.

THE GOAL of the game is to paint each block the same color as its border.
You can do this by dragging fish over the blocks:
- Each fish paints the blocks it is dragged over into a certain color.
  (The color of the block where the fish is currently in).
- Fish can't paint blocks that are occupied by another fish.
- Fish cannot be dropped in a block that is occupied by another fish.

When a new game starts:
- A certain number of blocks is displayed on the screen (by appending rows with blocks to the DOM).
  I made a function that distributes the blocks on the screen with maximum usage of the window size
  (no matter what size the window has).
- Each block is given a random color and each block border is also given a random color (this can be another color).
- The fish are put in random blocks. For each color there is a fish (7 fish in total).
  The blocks are given the color of the fish.
- When the window size changes after starting the game, everything in the game keeps its relative size and position.
