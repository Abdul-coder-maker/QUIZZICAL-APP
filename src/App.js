import "./App.css";

import React from "react";
function App() {
  const [isQuizz, setIsQuizz] = React.useState(false);
  const [data, setData] = React.useState([]);
  let [answers, setAnswers] = React.useState([]);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [result, setResult] = React.useState([]);
  const [fetchAPI, setFetchAPI] = React.useState(false);
  const [formData, setFormData] = React.useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });
  React.useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple&encode=url3986"
    )
      .then((res) => res.json())
      .then((data) => {
        setData(
          data.results.map((question) => ({
            ...question,
            answers: [
              decodeURIComponent(question["correct_answer"]),
              ...question["incorrect_answers"].map((i) =>
                decodeURIComponent(i)
              ),
            ].sort(() => (Math.random() > 0.5 ? 1 : -1)),
          }))
        );
      })
      .catch((err) => console.log(err));
  }, [fetchAPI]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("submited");
    setShowAnswer(true);
    //  formData[`question${i + 1}`] == answer
    data.map((answer, i) => {
      setResult((prevValue) => [
        ...prevValue,
        formData[`question${i + 1}`] ===
          decodeURIComponent(answer["correct_answer"]),
      ]);
    });
  }
  return (
    <div className="w-screen min-h-screen bg-[#F5F7FB] text-black flex justify-center items-center antialiased">
      {isQuizz ? (
        <form
          className="max-w-4xl px-5 mx-auto space-y-5 md:p-0"
          onSubmit={handleSubmit}
        >
          {data.map((quiz, i) => {
            return (
              <div key={i} className="pb-4 space-y-2 border-b-2">
                <p className="text-lg font-bold text-indigo-900 sm:text-xl">
                  {decodeURIComponent(quiz.question)}
                </p>
                <div className="flex flex-col mt-2 sm:flex-row sm:justify-between sm:flex-wrap">
                  {quiz.answers.map((answer, index) => {
                    return (
                      <div className="" key={index}>
                        <input
                          className="appearance-none focus:outline-none"
                          type="radio"
                          id={answer}
                          name={`question${i + 1}`}
                          value={answer}
                          checked={formData[`question${i + 1}`] === answer}
                          onChange={handleChange}
                        />
                        <label
                          key={index}
                          htmlFor={answer}
                          className={
                            showAnswer &&
                            decodeURIComponent(data[i]["correct_answer"]) ===
                              answer
                              ? `p-2 rounded-xl !text-indigo-900 text-xs sm:text-sm font-medium !bg-green-200 block sm:inline`
                              : showAnswer &&
                                decodeURIComponent(
                                  data[i]["correct_answer"]
                                ) !== answer &&
                                formData[`question${i + 1}`] === answer
                              ? "p-2 rounded-xl !bg-red-200 text-xs sm:text-sm font-medium  block sm:inline"
                              : showAnswer
                              ? "border border-gray-400 p-2 rounded-xl text-gray-400 text-xs sm:text-sm font-medium block sm:inline"
                              : "border border-indigo-700 p-2 rounded-xl text-indigo-900 text-xs sm:text-sm font-medium hover:cursor-pointer block sm:inline"
                          }
                        >
                          <span>{answer}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {showAnswer ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl font-extrabold text-indigo-900">
                Your score is {result.filter((answer) => answer).length}/
                {result.length}
              </span>
              <button
                title="submit to check answers"
                className="px-5 py-2 text-lg font-medium text-white bg-indigo-700 shadow rounded-xl focus:outline-none"
                onClick={() => {
                  setIsQuizz(false);
                  setData([]);
                  setAnswers([]);
                  setShowAnswer(false);
                  setResult([]);
                  setFetchAPI((prevValue) => !prevValue);
                  setFormData({
                    question1: "",
                    question2: "",
                    question3: "",
                    question4: "",
                    question5: "",
                  });
                }}
                type="button"
              >
                Repeat Quizz
              </button>
            </div>
          ) : (
            <button
              title="submit to check answers"
              className="block px-10 py-2 mx-auto text-lg font-medium text-white bg-indigo-700 shadow rounded-xl focus:outline-none"
            >
              Check Answers
            </button>
          )}
        </form>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-900 sm:text-6xl">
            Quizzical
          </h1>
          <p className="mt-2 text-xl font-medium text-indigo-700">
            General Information Quiz
          </p>
          <p className="text-indigo-700">By Abdulrahman Nasser</p>
          <button
            onClick={() => {
              setIsQuizz(true);
            }}
            title="click to start the quizz"
            className="px-10 py-2 mt-4 text-lg font-medium text-white transition-colors duration-500 bg-indigo-700 shadow-lg rounded-xl focus:outline-none hover:bg-indigo-600 hover:shadow-indigo-600/50 shadow-indigo-700/50"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
