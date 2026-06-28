import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const TestAttempt = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // const [warningCount, setWarningCount] = useState(0);

  const answersRef = useRef({});
  const submittedRef = useRef(false);

  const fetchAttemptQuestions = async () => {
    try {
      const response = await api.get(
        `/student/tests/attempts/${attemptId}/questions`
      );

      const savedAnswerResponse = await api.get(
        `/student/tests/attempts/${attemptId}/answers`
      );

      setTest(response.data.test);
      setAttempt(response.data.attempt);

      setAnswers(savedAnswerResponse.data.answers || {});
      answersRef.current = savedAnswerResponse.data.answers || {};

      const endsAt = new Date(response.data.attempt.endsAt).getTime();
      const now = Date.now();
      setTimeLeft(Math.max(0, Math.floor((endsAt - now) / 1000)));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttemptQuestions();
  }, [attemptId]);

  const saveAnswerToBackend = async (questionId, answer) => {
    try {
      await api.post(`/student/tests/attempts/${attemptId}/answers`, {
        questionId,
        answer
      });
    } catch (error) {
      console.log("Auto-save failed");
    }
  };

  const submitTest = async ({ autoSubmitted = false } = {}) => {
    if (submittedRef.current) return;

    try {
      submittedRef.current = true;
      setSubmitting(true);

      await api.post(`/student/tests/attempts/${attemptId}/submit`, {
        answers: answersRef.current,
        autoSubmitted
      });

      navigate(`/student/attempts/${attemptId}/result`);
    } catch (error) {
      submittedRef.current = false;
      setError(error.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (timeLeft <= 0) {
      submitTest({ autoSubmitted: true });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest({ autoSubmitted: true });
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeLeft]);

  useEffect(() => {
    // const handleVisibilityChange = () => {
    //   if (document.hidden && !submittedRef.current) {
    //     setWarningCount((prev) => prev + 1);
    //   }
    // };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleCopy = (e) => {
      e.preventDefault();
    };

    const handleCut = (e) => {
      e.preventDefault();
    };

    const handlePaste = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (
        e.ctrlKey &&
        ["c", "x", "v", "a", "s", "p", "u"].includes(key)
      ) {
        e.preventDefault();
      }

      if (e.key === "PrintScreen") {
        e.preventDefault();
        alert("Screenshots are not allowed during the test.");
      }

      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    // document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // useEffect(() => {
  //   if (warningCount > 0) {
  //     alert(
  //       `Warning ${warningCount}: Do not switch tabs during the test.`
  //     );
  //   }
  // }, [warningCount]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [timeLeft]);

  const setAnswer = (questionId, value) => {
    const updatedAnswers = {
      ...answersRef.current,
      [questionId]: value
    };

    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers;

    saveAnswerToBackend(questionId, value);
  };

  const setMatchAnswer = (questionId, leftId, rightId) => {
    const currentQuestionAnswer = answersRef.current[questionId] || {};

    const updatedAnswerForQuestion = {
      ...currentQuestionAnswer,
      [leftId]: rightId
    };

    const updatedAnswers = {
      ...answersRef.current,
      [questionId]: updatedAnswerForQuestion
    };

    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers;

    saveAnswerToBackend(questionId, updatedAnswerForQuestion);
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading test...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container test-secure-window">
      <div className="test-header-sticky">
        <div>
          <h2>{test.title}</h2>
          <p>
            {test.subject} | {test.totalMarks} Marks
          </p>
          {/* {warningCount > 0 && (
            <p className="warning-text">
              Tab switch warnings: {warningCount}
            </p>
          )} */}
        </div>

        <div className="timer-box">{formattedTime}</div>
      </div>

      <div className="attempt-layout">
        {test.questions.map((question) => (
          <div className="attempt-question-card" key={question.id}>
            <div className="question-preview-header">
              <strong>
                Q{question.orderNo}. {question.questionType}
              </strong>
              <span>{question.marks} Mark(s)</span>
            </div>

            <p className="attempt-question-text">{question.questionText}</p>

            {(question.questionType === "MCQ" ||
              question.questionType === "ODD_ONE_OUT") && (
              <div className="attempt-options">
                {question.options.map((option) => (
                  <label key={option.id} className="attempt-option">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => setAnswer(question.id, option.id)}
                    />
                    <span>{option.optionText}</span>
                  </label>
                ))}
              </div>
            )}

            {question.questionType === "TRUE_FALSE" && (
              <div className="attempt-options">
                <label className="attempt-option">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === "true"}
                    onChange={() => setAnswer(question.id, "true")}
                  />
                  <span>True</span>
                </label>

                <label className="attempt-option">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === "false"}
                    onChange={() => setAnswer(question.id, "false")}
                  />
                  <span>False</span>
                </label>
              </div>
            )}

            {["CORRELATION", "ONE_WORD", "FILL_BLANK"].includes(
              question.questionType
            ) && (
              <input
                className="attempt-text-answer"
                type="text"
                placeholder="Enter your answer"
                value={answers[question.id] || ""}
                onChange={(e) => setAnswer(question.id, e.target.value)}
              />
            )}

            {question.questionType === "MATCH_PAIR" && (
              <div className="match-answer-box">
                {question.leftItems.map((leftItem) => (
                  <div className="match-row" key={leftItem.id}>
                    <strong>{leftItem.text}</strong>

                    <select
                      value={answers[question.id]?.[leftItem.id] || ""}
                      onChange={(e) =>
                        setMatchAnswer(question.id, leftItem.id, e.target.value)
                      }
                    >
                      <option value="">Select match</option>
                      {question.rightItems.map((rightItem) => (
                        <option value={rightItem.id} key={rightItem.id}>
                          {rightItem.text}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {question.questionType === "WRONG_PAIR" && (
              <div className="attempt-options">
                {question.pairs.map((pair) => (
                  <label key={pair.id} className="attempt-option">
                    <input
                      type="radio"
                      name={question.id}
                      value={pair.id}
                      checked={answers[question.id] === pair.id}
                      onChange={() => setAnswer(question.id, pair.id)}
                    />
                    <span>
                      {pair.leftText} → {pair.rightText}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          className="submit-test-btn"
          onClick={() => submitTest({ autoSubmitted: false })}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Test"}
        </button>
      </div>
    </div>
  );
};

export default TestAttempt;
