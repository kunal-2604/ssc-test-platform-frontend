import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const TestResult = () => {
  const { attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = async () => {
    try {
      const response = await api.get(
        `/student/tests/attempts/${attemptId}/result`
      );
      setResult(response.data.result);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading result...</h2>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="page-container">
        <div className="error-box">Result not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h1>Test Result</h1>
        <p>{result.test.title}</p>

        <div className="info-grid">
          <div>
            <strong>Score</strong>
            <span>
              {result.totalScore} / {result.totalMarks}
            </span>
          </div>

          <div>
            <strong>Status</strong>
            <span>{result.status}</span>
          </div>

          <div>
            <strong>Subject</strong>
            <span>{result.test.subject}</span>
          </div>

          <div>
            <strong>Module</strong>
            <span>{result.test.module}</span>
          </div>
        </div>

        <Link to="/student/tests" className="primary-link-btn">
          Back to My Tests
        </Link>
      </div>

      <div className="attempt-layout result-question-list">
        {result.questions.map((question) => (
          <div className="attempt-question-card" key={question.id}>
            <div className="question-preview-header">
              <strong>
                Q{question.orderNo}. {question.questionType}
              </strong>

              <span>
                {question.studentAnswer?.marksAwarded || 0} / {question.marks}
              </span>
            </div>

            <p>{question.questionText}</p>

            <p>
              <strong>Status:</strong>{" "}
              {question.studentAnswer?.isCorrect ? "Correct" : "Wrong"}
            </p>

            {["TRUE_FALSE", "CORRELATION", "ONE_WORD", "FILL_BLANK"].includes(
              question.questionType
            ) && (
              <>
                <p>
                  <strong>Your Answer:</strong>{" "}
                  {String(question.studentAnswer?.answer || "-")}
                </p>
                <p>
                  <strong>Correct Answer:</strong> {question.correctAnswer}
                </p>
              </>
            )}

            {(question.questionType === "MCQ" ||
              question.questionType === "ODD_ONE_OUT") && (
              <ul>
                {question.options.map((option) => (
                  <li key={option.id}>
                    {option.optionText} {option.isCorrect ? "✅ Correct" : ""}
                    {question.studentAnswer?.answer === option.id
                      ? " ← Your Answer"
                      : ""}
                  </li>
                ))}
              </ul>
            )}

            {question.questionType === "WRONG_PAIR" && (
              <ul>
                {question.matchPairs.map((pair) => (
                  <li key={pair.id}>
                    {pair.leftText} → {pair.rightText}{" "}
                    {pair.isWrong ? "❌ Wrong Pair" : ""}
                    {question.studentAnswer?.answer === pair.id
                      ? " ← Your Answer"
                      : ""}
                  </li>
                ))}
              </ul>
            )}

            {question.questionType === "MATCH_PAIR" && (
              <ul>
                {question.matchPairs.map((pair) => (
                  <li key={pair.id}>
                    {pair.leftText} → {pair.rightText}{" "}
                    {question.studentAnswer?.answer?.[pair.id] === pair.id
                      ? "✅"
                      : "❌"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResult;
