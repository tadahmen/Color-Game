let colorList = ["purple", "red", "lightblue", "white", "lightgreen", "orange", "yellow"];
let totalColors = colorList.length;
let fishPositions = [];
let numberOfBlocks = 0;

function start () {
  console.log("you can play now");
  $("#intro").hide();
  $(".fish").attr("draggable", true);
  countDown()
}

function intro () {
  $('#play').click(function(){
    console.log("starting game");
    $('#intro').css({'transition': 'opacity 1.5s', 'opacity': '0.8'});
    $('#play').css({'background-color': 'orange'});
    countDownToStart (3)
  });
}

function countDownToStart (time) {
  $("#play").html("<h1>" + time + "</h1>")
  if (time > 0) {
    console.log("counting down: " + time);
    setTimeout(function(){ countDownToStart (time-1) }, 1000);
  } else {
    $('#play').css({'background-color': 'green'});
    setTimeout(function(){
      $("#intro").animate({left: '-1000px'}, "fast", start)
    }, 1000)
  }
}

function countDown() {
  let counter = setInterval(count, 1000);
  function count () {
    if (sessionStorage.getItem("finished")){
      clearInterval(counter)
    } else {
      let time = parseInt(sessionStorage.getItem("time"));
      time--
      document.getElementById("time").innerHTML = time;
      sessionStorage.setItem("time", time.toString())
    }
  }
}

function initialize(){
  sessionStorage.setItem("score", "0");
  sessionStorage.setItem("time", 300);
  sessionStorage.removeItem("finished");
  $('body').css({ height: $(window).height() });
  createBlocks(24);
  createFish();
  intro();
}

function randomColor() {
    let randomIndex = Math.floor(Math.random() * totalColors);
    // console.log(randomIndex);
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
    numberOfBlocks = amount;  //value also used in function putFishInBlock

    let blocksContainerMargin = 10;
    /*window ratio is needed to calculate how to get all blocks in the screen while making optimal use of screenspace*/
    let freeHeight = $(window).height() - $("#blocks-container").offset().top;
    // console.log("blocks-container offset = " + $("#blocks-container").offset().top);
    let freeWidth = $(window).width() - (blocksContainerMargin*2);
    // console.log("free width = " + freeWidth);
    let emptyWindowRatio = freeWidth/freeHeight;
    /*devide this in equal squares*/
    let blocksPerSquare = amount / emptyWindowRatio;
    let blocksPerRow = Math.ceil(Math.sqrt(blocksPerSquare) * emptyWindowRatio);
    let blockWidth = 100/blocksPerRow;
    // console.log("blockWidth is " + blockWidth);
    let absoluteBlockBorderWidth = 0.05 * blockWidth * $(window).width() / 100;
    // console.log("blockborder width is: " + absoluteBlockBorderWidth);
    let numberOfRows = Math.ceil(amount / blocksPerRow);

    createRows(numberOfRows);

    // put blocks in rows
    let blockColor = "";
    let borderColor = "";
    let i = 0;
    let j = 0;
    let k = 0;


    for (j=0 ;j<numberOfRows; j++){
      for (k=0; k<blocksPerRow; k++) {
        if (i<amount) {
          blockColor = randomColor();
          borderColor = randomColor();
          // console.log ("color is: " + blockColor);
          let block = "<div class = 'colorBlock' style = 'background-color: " + blockColor + "; border: " + absoluteBlockBorderWidth + "px solid " + borderColor + "; width: " + blockWidth + "%; padding-bottom: " + ((100/blocksPerRow)-2) + "%' ondragover = 'droppable(event)' ondrop = 'drop (event)'> </div>";
          $(".block-row").eq(j).append(block);
          i++
        }
      }
    }
}

function notInList(randomBlock) {
  let listLength = fishPositions.length;
  let i = 0;
  for (i=0; i<=listLength; i++) {
      if (fishPositions[i] === randomBlock) {
        // console.log("returns false");
        return false;
      }
  }
  // console.log("returns true");
  return true;
}

function putFishInBlock (fishColor) {
    let randomBlock = Math.floor(Math.random()*numberOfBlocks);
    // console.log ("randomBlock is: " + randomBlock);
    if (notInList(randomBlock)) {
        fishPositions.push(randomBlock);
        // console.log("the fishpositions are " + fishPositions);
        fishBlock = $(".colorBlock").eq(randomBlock);
        fishBlock.append("<img id = '" + fishColor + "' class= 'fish' src = http://www.icon2s.com/wp-content/uploads/2014/06/animal-icon-fish-yellow.png draggable = 'false' style='color:" + fishColor + "' ondragstart = 'drag(event)' ondragover = 'noTarget(event)'/>");
                          //(the fish image is a free web icon)
        $(fishBlock).css({
          backgroundColor: fishColor,
          borderColor: fishColor
          });
    } else {
      putFishInBlock (fishColor)
    }
}

function createFish() {
    let i = 0;
    let color = "";
    for (i = 0; i < totalColors; i++) {
        color = colorList[i];
        // console.log("color fish is " + color);
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

function changeScore (block, fishColor) {
  let borderColor = block.style.borderColor;
  // console.log("block border color = " + block.style.borderColor);
  let score = parseInt(sessionStorage.getItem("score"));
  // console.log("score = " + score);
  if (fishColor === borderColor) {
    score += 40
  } else {
    score -= 40
  }
  document.getElementById("score").innerHTML = score;
  sessionStorage.setItem("score", score.toString() )
  // console.log("new score in sessionstorage = " + sessionStorage.getItem("score"));
}

function checkFinished () {
let borderColor = "";
let blockColor = "";
let allBlocks = $(".colorBlock");
let amountOfBlocks = allBlocks.length;
  for (i=0; i < amountOfBlocks; i++) {
    borderColor = allBlocks[i].style.borderColor;
    blockColor = allBlocks[i].style.backgroundColor;
    if (borderColor != blockColor) return false;
  }
  sessionStorage.setItem("finished", "true");
  return true
}

function droppable (event) {
  event.preventDefault();
  if (noFishInBlock(event.target)) {
    let fishColor = sessionStorage.getItem("color"); //dataTransfer cannot be accessed in 'ondragover' event.
    let block = event.target;
    let blockColor = block.style.backgroundColor;
    if (blockColor != fishColor) {
      // console.log("change color");
      block.style.backgroundColor = fishColor;
      changeScore(block, fishColor)
    }
  }
  // console.log("no fish in block? = " + noFishInBlock(event.target) );
}

function noTarget (event) {
    event.stopPropagation();  //'stops' this element from being a target (because the parent div is a target)
}

function relativeXPosition (droppedFish, event) {
  let xPositionFish = event.clientX - offsetX;
  let xPositionBlock = $(event.target).position().left;
  let xPositionInBlock = xPositionFish - xPositionBlock;
  let widthBlock = $(event.target).outerWidth();
  let relativeXPosition = (xPositionInBlock /widthBlock) * 100 + "%";
  return relativeXPosition
}

function relativeYPosition (droppedFish, event) {
  let yPositionFish = event.clientY - offsetY;
  let yPositionBlock = $(event.target).position().top;
  // console.log("offsetY = " + offsetY);
  // console.log("y position block = " + yPositionBlock);
  let yPositionInBlock = yPositionFish - yPositionBlock;
  let heightBlock = $(event.target).height()+$(event.target).outerHeight();
  let relativeYPosition = (yPositionInBlock /heightBlock) * 100 + "%";
  // console.log("relative y position = " + yPositionRelative);
  return relativeYPosition
}

function countScore() {
  let time = parseInt(sessionStorage.getItem("time"));
  let score = parseInt(sessionStorage.getItem("score"));
  console.log("time is: " + time);
  let counter = setInterval(count, 20);
  function count () {
    if (time > 0) {
      time--
      score++
      document.getElementById("clock").getElementsByClassName("text")[0].innerHTML = "adding bonus:";
      document.getElementById("time").innerHTML = time;
      document.getElementById("score").innerHTML = score + "!";
    } else {
      document.getElementById("clock").innerHTML = "Well done!";
      clearInterval(counter)
    }
  }
}

function celebrate () {
  let fish = $('.fish');
  fish.animate({left: '-12%'}, 500);
  fish.animate({left: '-2%'}, 200, function(){fish.toggleClass("mirror-fish")} );
  fish.animate({left: '27%'}, 500);
  fish.animate({left: '17%'}, 200, function(){fish.toggleClass("mirror-fish"); celebrate()} );
}

function drop (event) {
  if (noFishInBlock(event.target)) {
    event.preventDefault();
    let id = event.dataTransfer.getData("text");
    let droppedFish = document.getElementById(id);
    event.target.appendChild(droppedFish);

    droppedFish.style.left = relativeXPosition (droppedFish, event);

    droppedFish.style.top = relativeYPosition (droppedFish, event);
    if (checkFinished()) {
      $(".fish").attr("draggable",false);
      celebrate();
      countScore()
    }
    // console.log(checkFinished())
  }
}
