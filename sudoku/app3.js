//it uses a premaid level as a refrence and mixes it x-times using 5 diffrent operations it chooses
//randomly between the 5 operations without changing in the core col, row or box

// level generator script
var alphaRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
var gridAnswer = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];
var gridAnswerCol = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];
var gridAnswerBox = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];
var twoDArray = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];
var arrTemp = [],
  arrTemp1 = [],
  arrTemp2 = [],
  arrTemp3 = [];
//intialize refrence grid
var grid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

//arrays that is required for checking box logic
var boxLeftNum = [1, 2, 3, 1, 2, 3, 1, 2, 3];
var boxMiddleNum = [4, 5, 6, 4, 5, 6, 4, 5, 6];
var boxRightNum = [7, 8, 9, 7, 8, 9, 7, 8, 9];

var difficulty; //difficulty variable
if (localStorage.getItem("difficulty") === null) {
  difficulty = 60;
}
else{
  difficulty = localStorage.getItem("difficulty");
}

//rows are alpha cols are numbers

// A1 A2 A3 █ A4 A5 A6 █ A7 A8 A9
// B1 B2 B3 █ B4 B5 B6 █ B7 B8 B9
// C1 C2 C3 █ C4 C5 C6 █ C7 C8 C9
// ██████████████████████████████
// D1 D2 D3 █ D4 D5 D6 █ D7 D8 D9
// E1 E2 E3 █ E4 E5 E6 █ E7 E8 E9
// F1 F2 F3 █ F4 F5 F6 █ F7 F8 F9
// ██████████████████████████████
// G1 G2 G3 █ G4 G5 G6 █ G7 G8 G9
// H1 H2 H3 █ H4 H5 H6 █ H7 H8 H9
// I1 I2 I3 █ I4 I5 I6 █ I7 I8 I9


//main functions

intiallizeLevel();

//refresh level function /////a new level is loaded on page load automatically
function refreshLevel() {
  window.location.reload();
}

function intiallizeLevel() {
  // important settlment of grid for re-intiallzation of levels when calling after page load
  grid = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];
  mixer(grid);
  //randomly adds empty spaces for user to add his answers
  //i<48 dificulty
  for (var i = 0; i < difficulty; i++) {
    var int1 = getRandomIntBet(0, 8);
    var int2 = getRandomIntBet(0, 8);
    if (!grid[int1][int2] == "") {
      grid[int1][int2] = "";
    }
  }
  //intialize numbers on grid
  //I x1 -- X x9 -- Z x81
  for (var i = 0; i < 9; i++) {
    for (var x = 0; x < 9; x++) {
      if (grid[i][x] != "") {
        var elementNum = x + 1;
        document.getElementById(alphaRows[i] + elementNum).value = grid[i][x];
        document.getElementById(alphaRows[i] + elementNum).disabled = true;
        document.getElementById(alphaRows[i] + elementNum).style.backgroundColor = "rgb(80,80,80)";
      }
    }
  }
  textInputColor();
}

//checks if answer grid is valid
function submitLevel() {
  var hasWon = true;
  var gridCompleted = true;
  for (var i = 0; i < 9; i++) {
    for (var x = 0; x < 9; x++) {
      var elementNum = x + 1;
      if (document.getElementById(alphaRows[i] + elementNum).value == "") {
        alert("Please Fill all empty spaces first...");
        //stop checking if found 1 empty
        i = 9;
        x = 9;
        gridCompleted = false;
        break;
      }
    }
  }
  if (gridCompleted) {
    //fills answer array box
    fillGridBox();
    for (i = 0; i < 9; i++) {
      if (hasDuplicates(gridAnswerBox[i])) {
        hasWon = false;
      }
    }
    //fills answer arrays of rows and cols
    for (var z = 0; z < 9; z++) {
      for (var y = 0; y < 9; y++) {
        if (grid[z][y] != "") {
          var elementNum = y + 1;
          gridAnswer[z][y] = parseInt(document.getElementById(alphaRows[z] + elementNum).value);
          gridAnswerCol[y][z] = parseInt(document.getElementById(alphaRows[z] + elementNum).value);
          for (var w = 0; w < 9; w++) {
            if (hasDuplicates(gridAnswer[w]) || hasDuplicates(gridAnswerCol[w])) {
              hasWon = false;
            }
          }
        }
      }
    }
    console.log(gridAnswer);
  }



  // declare win and lose
  if (hasWon && gridCompleted) {
    //declare winner
    alert("You Won Congratulation ");
    refreshLevel();
  } else if (!hasWon && gridCompleted) {
    //declare loser
    alert("You Lose :( try again");
    refreshLevel();
  }
}

//styling numbers
function textInputColor() {
  //styling the grid
  for (var i = 0; i < 9; i++) {
    for (var x = 0; x < 9; x++) {
      var elementNum = x + 1;
      if (document.getElementById(alphaRows[i] + elementNum).value == "1") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(229,85,112)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "2") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(215,146,191)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "3") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(195,223,172)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "4") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(123,203,190)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "5") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(248,170,150)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "6") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(252,199,155)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "7") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(129,210,229)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "8") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(111,133,193)";
      }
      if (document.getElementById(alphaRows[i] + elementNum).value == "9") {
        var gridElement = document.getElementById(alphaRows[i] + elementNum);
        gridElement.style.color = "rgb(255,226,146)";
      }
    }
  }
}

//difficulty Manager stores variable in local storage
function difficultyManager(diffLevel) {
  switch (diffLevel) {
    case 0:
      difficulty = 0;
      localStorage.setItem("difficulty", difficulty);
      refreshLevel();
      break;
    case 1:
      difficulty = 20;
      localStorage.setItem("difficulty", difficulty);
      refreshLevel();
      break;
    case 2:
      difficulty = 60;
      localStorage.setItem("difficulty", difficulty);
      refreshLevel();
      break;
    case 3:
      difficulty = 80;
      localStorage.setItem("difficulty", difficulty);
      refreshLevel();
      break;
    case 4:
      difficulty = 180;
      localStorage.setItem("difficulty", difficulty);
      refreshLevel();
      break;
  }
}

//fill grid answer boxes each box is filled in an array pushed in a 2d array

function fillGridBox() {
  var h = 0;
  //alpha change every 3 boxes and numbers loop every 3 boxes
  //box 1
  for (i = 0; i < 3; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxLeftNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[0][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
  //box 2
  for (i = 0; i < 3; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxMiddleNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[1][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
  //box 3
  for (i = 0; i < 3; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxRightNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[2][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
  //box 4
  for (i = 3; i < 6; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxLeftNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[3][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
  //box 5
  for (i = 3; i < 6; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxMiddleNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[4][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
  //box 6
  for (i = 3; i < 6; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxRightNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[5][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  } //box 7
  for (i = 6; i < 9; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxLeftNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[6][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
  //box 8
  for (i = 6; i < 9; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxMiddleNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[7][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
  //box 9
  for (i = 6; i < 9; i++) {
    for (var t = 0; t < 3; t++) {
      h++;
      var elementNum = boxRightNum[t];
      var alpha = alphaRows[i];
      if (h < 8) {
        gridAnswerBox[8][h] = parseInt(document.getElementById(alpha + elementNum).value);
      }
    }
  }
}

//MIXER
//main mixing function responsible for mixing logic to not defy sudoku rules
function mixer(grid) {
  //////////////mixing refrence grid to add more levels//////////////
  var mixVariable = getRandomIntBet(3, 12);
  for (var i = 0; i < mixVariable; i++) {
    var switchMix = getRandomInt(4);
    switch (switchMix) {
      case 1: {
        //mixing rows without changing box
        for (i = 0; i < 3; i++) {
          mixRowsRandomly(grid);
          console.log("Mixed rows");
        }
      }
      break;
    case 2:
      //mixing 3 rows as a box element
      mix3Rows(grid);
      console.log("Mixed row box");
      break;
    case 3:
      //transpose grid to make col row and vice versa
      //transpose(grid);
      console.log("Transposed");
      //note that transposing a transposed 2d array makes it the original array getting 3 again removes the effect so it means that this will change only if it got called odd number times
      break;
    case 4:
      //mixing cols by (transpose-mix row-transpose)
      //transpose(grid);
      for (i = 0; i < 3; i++) {
        mixRowsRandomly(grid);
      }
      //transpose(grid);
      console.log("Mixed cols");
      break;
    case 5:
      //mixing 3 cols by (transpose mix 3 rows transpose)
      //transpose(grid);
      mix3Rows(grid);
      //transpose(grid);
      console.log("Mixed 3 col box");
      break;
    default:
    }
  }
}
//sub mixing function mix a given arrays with index
//mix 3 rows as a box unit
function mix3Rows(grid) {
  getRandomIntBet(1, 3);
  var indexArr = [0, 3, 6];
  var arrTemp1 = [];
  var arrTemp2 = [];
  var arrTemp3 = [];
  var arr1Index = indexArr[getRandomIntBet(0, 2)];
  var arr2Index = indexArr[getRandomIntBet(0, 2)];
  arrTemp1 = grid[arr1Index];
  arrTemp2 = grid[arr1Index + 1];
  arrTemp3 = grid[arr1Index + 2];
  grid[arr1Index] = grid[arr2Index];
  grid[arr1Index + 1] = grid[arr2Index + 1];
  grid[arr1Index + 2] = grid[arr2Index + 2];
  grid[arr2Index] = arrTemp1;
  grid[arr2Index + 1] = arrTemp2;
  grid[arr2Index + 2] = arrTemp3;
}
//MIX rows
function mixRowsRandomly(grid) {
  switch (getRandomIntBet(1, 3)) {
    case 1: //mix inside TOP 3 rows
      var rowMixerVariable = getRandomIntBet(0, 2);
      var rowMixerVariable2 = getRandomIntBet(0, 2)
      swapArrin2dArr(grid, rowMixerVariable, rowMixerVariable2);
      break;
    case 2: //mix inside MIDDLE 3 rows
      var rowMixerVariable = getRandomIntBet(3, 5);
      var rowMixerVariable2 = getRandomIntBet(3, 5)
      swapArrin2dArr(grid, rowMixerVariable, rowMixerVariable2);
      break;
    case 3: //mix inside BOTTOM 3 rows
      var rowMixerVariable = getRandomIntBet(6, 8);
      var rowMixerVariable2 = getRandomIntBet(6, 8)
      swapArrin2dArr(grid, rowMixerVariable, rowMixerVariable2);
      break;
  }
}
//swap arrays in grid
function swapArrin2dArr(twoDArray, arr1Index, arr2Index) {
  var arrTemp = [];
  arrTemp = twoDArray[arr1Index];
  twoDArray[arr1Index] = twoDArray[arr2Index];
  twoDArray[arr2Index] = arrTemp;
}

//functions used frequently in the mixing and logic process ===============================================

//function that make text input accept only numbers due to type"number" not working with maxlength
function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}

//random number generator in range
function getRandomIntBet(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive +1 to make maximum inclusive
}
//random number generator
function getRandomInt(max) {
  min = 1;
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive added +1 to make maximum inclusive
}
//transpose
function transpose(array, arrayLength) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray.push([]);
  };

  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < arrayLength; j++) {
      newArray[j].push(array[i][j]);
    };
  };

  return newArray;
}
//check if array has duplicate
function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}
