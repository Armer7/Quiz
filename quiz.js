"use strict";

// Quiz program

// class for storing an object with responses
class Answer {
  constructor(text, value) {
    this.text = text;
    this.value = value;
  }
}

// class for storing the object with questions
class Question {
  constructor(text, answers) {
    this.text = text;
    this.answers = answers;
  }

// return the answer
  Click(index) {
    return this.answers[index].value;
  }
}

// class for test implementation
class Test {
  constructor(questions) {

    // array of questions
    this.questions = questions;
    // number of points
    this.score = 0;
    // current question number
    this.current = 0;
  }

  Click(index) {
    // add earned points
    let value = this.questions[this.current].Click(index);
    this.score += value;
    let correct = -1;

    // if points were added, then the answer is correct
    if (value >= 1) correct = index;
    else {
      // looking for the right answer
      let currentQuestionAnswer = this.questions[this.current].answers;
      for (let i = 0; i < currentQuestionAnswer.length; i++) {
        if (currentQuestionAnswer[i].value >= 1) {
          correct = i;
          break;
        }
      }
    }
    this.Next();
    return correct;
  }

  // next question
  Next() {
    this.current++;
  }
}


// block with a render of a question
class DivQuestion {
  constructor(testQuestion, container) {
    this.testQuestion = testQuestion;
    this.numQuestion = this.testQuestion.current;
    this.answers = this.testQuestion.questions[this.numQuestion].answers;
    this.container = document.getElementById(container);
  }

  SetQuestion(endQuestion) {
    let txtBtn = endQuestion ? 'Finish' : 'Next';
    let div = document.createElement('div');
    div.id = `answer${this.numQuestion}`;

    let p = document.createElement('p');
    let newP;

    let radio = document.createElement('input');
    radio.type = 'radio';
    radio.className = 'radio';
    radio.name = `answer${this.numQuestion}`;
    let newRadio;

    let label = document.createElement('label');
    let newLabel;

    let inputSubmit = document.createElement('input');
    inputSubmit.type = 'submit';
    inputSubmit.value = txtBtn;
    inputSubmit.className = 'button';
    inputSubmit.setAttribute('index', this.numQuestion);
    inputSubmit.addEventListener('click',
      function (e) {
        getAnswer(e, e.target.getAttribute('index'));
      });

    newP = p.cloneNode(true);
    newP.innerHTML = `Вопрос ${this.numQuestion + 1} из ${test.questions.length}`;
    div.appendChild(newP);

    newP = p.cloneNode(true);
    newP.innerHTML = this.testQuestion.questions[this.numQuestion].text;
    div.appendChild(newP);

    for (let i = 0; i < this.answers.length; i++) {
      newRadio = radio.cloneNode(true);
      newLabel = label.cloneNode(true);
      newRadio.value = i;
      newLabel.innerHTML = this.answers[i].text;

      newP = p.cloneNode(true);
      newP.appendChild(newRadio);
      newP.appendChild(newLabel);

      div.appendChild(newP);
    }

    div.appendChild(inputSubmit);

    this.container.appendChild(div);
  }
}

// array of tests

const questions =
  [
    new Question('Сколько будет 2+2=',
      [
        new Answer('5', 0),
        new Answer('4', 1)
      ]),
    new Question('Какого цвета аппельсин',
      [
        new Answer('оранжевый', 1),
        new Answer('красный', 0),
        new Answer('розовый', 0)
      ]),
    new Question('Зебра',
      [
        new Answer('белая в черную полоску', 0),
        new Answer('черная в белую полоску', 0),
        new Answer('просто спала на пианино', 1)
      ])
  ];

// initialization
const test = new Test(questions);


// Start test
nextQuestion();


function nextQuestion() {

  if (test.current < test.questions.length) {
    // the last question, or not
    let endQuestion = (test.current === test.questions.length - 1);
    // render a window with a question
    let divQuestion = new DivQuestion(test, 'cont');
    divQuestion.SetQuestion(endQuestion);

  }
  // if the test is over, display the results
  else {
    document.getElementById('cont').innerHTML +=
      `<p class="score">
Вы ответили на ${test.score} ${numToText(test.score)} из ${test.questions.length}</p>`
  }
}


function getAnswer(e, index) {
  e.preventDefault();

  // We get the block of the current question
  let currentDiv = document.getElementById(`answer${index}`); //test.current
  // We get the button of the current question and the list of answers
  let currentBtn = currentDiv.querySelector('.button');
  let radioAll = currentDiv.querySelectorAll('.radio');

  // We go through the answers in search of the selected
  radioAll.forEach(i => {
    // if there is a selected one, then we start checking
    if (i.checked) {
      // block buttons
      currentBtn.disabled = true;
      currentBtn.classList.add('button_passive');
      // we get the answer
      let answerIndex = i.value;
      // we get the correct answer
      let answerCorrect = test.Click(answerIndex);
      // if the answer is correct
      if (answerCorrect === answerIndex) {
        // paint the answer green
        i.parentElement.classList.add('radio_correct');
      }
      // if not the correct answer
      else {
        // paint not correct in red, correct in green
        i.parentElement.classList.add('radio_wrong');
        radioAll[answerCorrect].parentElement.classList.add('radio_correct');
      }

      // let's start the next question
      setTimeout(nextQuestion, 1000);

    }

  });

}

// we form the ending for Russian numerals
const numToText = (value) => {

  const cases = [2, 0, 1, 1, 1, 2];
  const txt = ['вопрос', 'вопроса', 'вопросов'];
  return txt
    [
    (value % 100 > 4 && value % 100 < 20) ?
      2
      : cases
        [
        (value % 10 < 5) ?
          value % 10
          : 5
        ]
    ]
};

