let colorList = ["purple", "red", "lightblue", "white", "lightgreen", "orange", "yellow"];
let totalColors = colorList.length;
let fishPositions = [];
let numberOfBlocks = 0;

function initialize(){
  $('body').css({ height: $(window).height() });
  // $('#blocks-container').css({ margin: 0px 10px 0px 10px });
  createBlocks(25)
}

function randomColor() {
    let randomIndex = Math.floor(Math.random()*totalColors);
    console.log(randomIndex);
    return colorList[randomIndex]
  }

function createRows(amount) {
  let i=0;
  let row = "<div class = 'row block-row'> </div>"
  for (i=0; i<amount; i++) {
      $("#blocks-container").append(row)
  }
}

function createBlocks (amount) {
    numberOfBlocks = amount;
    let blockColor = "";
    let borderColor = "";

    /*window ratio is needed to calculate how to get all blocks in the screen while making optimal use of screenspace*/
    let freeWindowHeight = $(window).height() - $("#blocks-container").offset().top;
    let emptyWindowRatio = $(window).width()/freeWindowHeight;
    /*devide this in equal squares*/
    let blocksPerSquare = amount / emptyWindowRatio;
    let blocksPerRow = Math.ceil(Math.sqrt(blocksPerSquare) * emptyWindowRatio);
    let numberOfRows = Math.ceil(amount / blocksPerRow);

    createRows(numberOfRows);

    // putBlocksInRow(blocks)
    let i = 0;
    let j = 0;
    let k = 0;

    for (j=0 ;j<numberOfRows; j++){
      for (k=0; k<blocksPerRow; k++) {
        if (i<amount) {
          blockColor = randomColor();
          borderColor = randomColor();
          console.log ("color is: " + blockColor);
          let block = "<div class = 'colorBlock' style = 'background-color: " + blockColor + "; border: 5px solid " + borderColor + "; width: " + 100/blocksPerRow + "%; padding-bottom: " + ((100/blocksPerRow)-1.5) + "%' ondragover = 'droppable(event)' ondrop = 'drop (event)'> </div>";
          $(".block-row").eq(j).append(block);
          i++
        }
      }
    }
    // for (i=1; i<=amount; i++) {
    //     blockColor = randomColor();
    //     borderColor = randomColor();
    //     console.log ("color is: " + blockColor);
    //     let block = "<div class = 'colorBlock' style = 'background-color: " + blockColor + "; border: 5px solid " + borderColor + "' ondragover = 'droppable(event)' ondrop = 'drop (event)'> </div>";
    //     $("body").append(block);
    // }

    // let height = $(".colorBlock").css("width");
    // $(".colorBlock").css({height: height});
    createFish();
}

function notInList(randomBlock) {
  let listLength = fishPositions.length;
  let i = 0;
  for (i=0; i<=listLength; i++) {
      if (fishPositions[i] === randomBlock) {
        console.log("returns false");
        return false;
      }
  }
  console.log("returns true");
  return true;
}

function putFishInBlock (fishColor) {
    let randomBlock = Math.floor(Math.random()*numberOfBlocks);
    console.log ("randomBlock is: " + randomBlock);
    if (notInList(randomBlock)) {
        fishPositions.push(randomBlock);
        console.log("the fishpositions are " + fishPositions);
        fishBlock = $(".colorBlock").eq(randomBlock);
        fishBlock.append("<img id = '" + fishColor + "' class= 'fish' src = http://www.icon2s.com/wp-content/uploads/2014/06/animal-icon-fish-yellow.png draggable = 'true' style='color:" + fishColor + "' ondragstart = 'drag(event)' ondragover = 'noTarget(event)'/>");
          //the fish image is a free web icon
        document.getElementsByClassName("colorBlock")[randomBlock].style.backgroundColor = fishColor;
    } else {
      putFishInBlock (fishColor)
    }
}

function createFish() {
    let i = 0;
    let color = "";
    for (i = 0; i < totalColors; i++) {
        color = colorList[i];
        console.log("color fish is " + color);
        putFishInBlock(color);
    }
}

function drag (event) {
  event.dataTransfer.setData(type ="text", event.target.id);
  sessionStorage.setItem("color", event.target.style.color); //to get color in dragover event; dataTransfer can only be accessed in drop event.
  offsetX = event.clientX - $(event.target).offset().left;
  offsetY = event.clientY - $(event.target).offset().top;
}

function noFishInBlock (block) {
  return !$(block).children()[0]
}

function droppable (event) {
  event.preventDefault();
  if (noFishInBlock(event.target)) {
    let fishColor = sessionStorage.getItem("color"); //dataTransfer cannot be accessed in 'ondragover' event.
    console.log("fishColor " + fishColor);
    event.target.style.backgroundColor = fishColor;
  }
  console.log("no fish in block? = " + noFishInBlock(event.target) );
}

function noTarget (event) {
    event.stopPropagation();  //'stops' this element from being a target (because the parent div is a target)
}

function drop (event) {
  if (noFishInBlock(event.target)) {
    event.preventDefault();
    let id = event.dataTransfer.getData("text");
    let droppedFish = document.getElementById(id);
    event.target.appendChild(droppedFish);

    let xPositionFish = event.clientX - offsetX;
    let xPositionBlock = $(event.target).position().left;
    let xPositionInBlock = xPositionFish - xPositionBlock;
    let widthBlock = $(event.target).outerWidth();
    let xPositionRelative = (xPositionInBlock /widthBlock) * 100 + "%";
    droppedFish.style.left = xPositionRelative;

    let yPositionFish = event.clientY - offsetY;
    let yPositionBlock = $(event.target).position().top;
    console.log("offsetY = " + offsetY);
    console.log("y position block = " + yPositionBlock);
    let yPositionInBlock = yPositionFish - yPositionBlock;
    let heightBlock = $(event.target).height()+$(event.target).outerHeight();
    let yPositionRelative = (yPositionInBlock /heightBlock) * 100 + "%";
    console.log("relative y position = " + yPositionRelative);
    droppedFish.style.top = yPositionRelative;
  }
}

/* to drag-drop either text or color*/
// function drop (event) {
//   let data = "";
//   console.log("dropping data");
//   event.preventDefault();
//   console.log(event.dataTransfer.getData("text"));
//   if (event.dataTransfer.getData("text") !== "") {
//       console.log ("getData 'text' is defined");
//       data = event.dataTransfer.getData("text");
//       event.target.appendChild(document.getElementById(data));
//       event.dataTransfer.setData(type ="text", "undefined");
//   } else {
//         console.log ("getData 'text' is not defined");
//         data = event.dataTransfer.getData("color");
//         event.target.style.backgroundColor = data;
//         event.dataTransfer.setData(type="color", "undefined")
//     }
// }
