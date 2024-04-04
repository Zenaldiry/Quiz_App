let data;
let current = 0;
let html = "../Quiz_App/HTML_questions.json";
let js = "../Quiz_App/javascript_questions.json";
let css = "../Quiz_App/css_questions.json";
let questionAreaDiv = document.querySelector(".question-area");
let quizGeneralDiv = document.querySelector(".quiz-app");
let quizInfoDiv = document.querySelector(".quiz-info");
let qSpanCount = document.querySelector(".question-count span");
let answerAreaDiv = document.querySelector(".answer-area");
let select = document.querySelector(".select");
let options = Array.from(select.children);
select.onchange = () => {
  select.disabled = true;
  options.forEach((option) => {
    if (option.selected === true) {
      if (option.value === "html") {
        getData(html);
      } else if (option.value === "javasscript") {
        getData(js);
      } else if (option.value === "css") {
        getData(css);
      }
    }
  });
};
let submitBtn;
let countdown;
let result = 0;

// getting data function================================================================================================
function getData(type) {
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", type, true);
  myRequest.send();
  myRequest.onreadystatechange = () => {
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      data = JSON.parse(myRequest.response);
      qSpanCount.innerHTML = data.length;
      creatingQuestion(data);
      creatingAnswers();
      creatBtn();
      bulletsAndSpans(data);
      submitBtn = document.querySelector("#submit_button");
      createCountDown();
      cDown(5);
      submitBtn.onclick = () => {
        if (current < data.length) {
          checkAnswers(data);
          questionAreaDiv.innerHTML = "";
          answerAreaDiv.innerHTML = "";
          clearInterval(countdown);
          cDown(5);
          current++;
          creatingQuestion(data);
          creatingAnswers();
          let spans = document.querySelector(".spans");
          if (current < data.length) {
            spans.children[current].classList.add("on");
          } else if (current === data.length) {
            resultFun();
          }
        }
      };
    }
  };
}
// getting data function=========================================================================================
// creating question h2==========================================================================================
function creatingQuestion(data) {
  if (current < data.length) {
    let question = document.createElement("h2");
    question.innerHTML = data[current].title;
    questionAreaDiv.append(question);
  }
}
// creating question h2===========================================================================================
// creating answer divs===========================================================================================
function creatingAnswers() {
  for (let i = 1; i <= 4; i++) {
    if (current < data.length) {
      let answerHolder = document.createElement("div");
      answerHolder.classList.add("answer");
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.innerHTML = data[current][`answer_${i}`];
      let radio = document.createElement("input");
      radio.type = "radio";
      radio.id = `answer_${i}`;
      radio.name = `question`;
      if (i === 1) {
        radio.checked = true;
      }
      answerHolder.append(radio);
      answerHolder.append(label);
      answerAreaDiv.append(answerHolder);
    }
  }
}
// creating answer divs==================================================================================================
// creating submit button==================================================================================================
function creatBtn() {
  let btn = document.createElement("button");
  btn.id = "submit_button";
  btn.innerHTML = "Submit";
  quizGeneralDiv.append(btn);
}
// creating submit button==================================================================================================

// creting bullets and spans==================================================================================================
function bulletsAndSpans(data) {
  let bulletsDiv = document.createElement("div");
  bulletsDiv.classList.add("bullets");
  let spansDiv = document.createElement("div");
  spansDiv.classList.add("spans");
  for (let i = 0; i < data.length; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.classList.add("on");
    }
    spansDiv.append(span);
  }
  bulletsDiv.append(spansDiv);
  quizGeneralDiv.append(bulletsDiv);
}
// creting bullets and spans==================================================================================================
// creating reuslt div==================================================================================================
function creatResult() {
  let resultDiv = document.createElement("div");
  resultDiv.classList.add("result");
  let span1 = document.createElement("span");
  resultDiv.append(span1);
  quizGeneralDiv.append(resultDiv);
}
// creating reuslt div==================================================================================================

// checkAnswers function==================================================================================================
function checkAnswers(data) {
  let choosenAnswer;
  let rightAnswer = data[current].right_answer;
  let radios = document.getElementsByName("question");
  radios.forEach((radio) => {
    if (radio.checked === true) {
      choosenAnswer = radio.parentElement.children[1].innerHTML;
      if (choosenAnswer === rightAnswer) {
        result++;
      }
    }
  });
}
// checkAnswers function==================================================================================================

// result function==================================================================================================
function resultFun() {
  let childrens = document.querySelectorAll(
    ".quiz-app > div:not(:first-child)"
  );
  childrens.forEach((child) => {
    child.remove();
  });
  submitBtn.remove();
  let resultDiv = document.createElement("div");
  resultDiv.classList.add("result");
  quizGeneralDiv.append(resultDiv);
  if (result === data.length) {
    resultDiv.innerHTML = `<span class="perfect">Perfect</span> you solved ${result} of ${data.length} `;
  } else if (result > data.length / 2 && result !== 10) {
    resultDiv.innerHTML = `<span class="good">Good</span> you solved ${result} of ${data.length} `;
  } else {
    resultDiv.innerHTML = `<span class="bad">Bad</span> you solved ${result} of ${data.length} `;
  }
  select.disabled = true;
}
// result function==================================================================================================
// creating countdown div ==================================================================================================
function createCountDown() {
  let countDownDiv = document.createElement("div");
  countDownDiv.classList.add("count-down");
  quizGeneralDiv.append(countDownDiv);
}
// creating countdown div ==================================================================================================
// countdown==================================================================================================
function cDown(duration) {
  let cDownDiv = document.querySelector(".count-down");
  let minutes, seconds;
  countdown = setInterval(() => {
    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    cDownDiv.innerHTML = `${minutes}:${seconds}`;
    if (--duration < 0) {
      clearInterval(countdown);
      submitBtn.click();
    }
  }, 1000);
}
// countdown==================================================================================================
