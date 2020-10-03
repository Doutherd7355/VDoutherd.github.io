function getHistory() {
  return document.getElementById("history-value").innerText;
}

function printHistory(num) {
  document.getElementById("history-value").innerText=num;
}

function getOutput(){
  return document.getElementById("output-value").innerText;

}

function printOutput(num) {

  if(num ===""){
    document.getElementById("output-value").innerText=(num);

  }else{
    document.getElementById("output-value").innerText=getFormattedNumber(num);
  }
}

// comma for valueOf()
function getFormattedNumber (num) {
  const n = Number(num);
  const value = n.toLocaleString("en");
  return value;
}
function reverseNumberFormat (num){
  return Number(num.replace(/,/g,''));
}

// Input of operators and numbers

let operator = document.getElementsByClassName("operator");
for (var i =0; i<operator.length; i++){
  operator[i].addEventListener('click', function(){
    if(this.id="clear"){
      printHistory("");
      printOutput("");
    } else if(this.id === "backspace"){
      let outupt=reverseNumberFormat(getOutput()).toString();
      if(output){
        // if output has a value
        output= output.substr(0,output.length-1);
        printOutput(output);
      }
    }
  });
}

let number = document.getElementsByClassName("number");
for (var i =0; i<number.length; i++){
  number[i].addEventListener('click', function(){
    let output=reverseNumberFormat(getOutput());
    if(output != NaN) {
      // if output is a number
      output=output+this.id;
      printOutput(output);
    }
  });
}
