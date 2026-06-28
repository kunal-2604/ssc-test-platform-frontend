import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const AdminResultDetail = () => {
  const { attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = async () => {
    try {
      const response = await api.get(`/admin/reports/results/${attemptId}`);
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
      <div className="page-heading with-action">
        <div>
          <h1>Result Detail</h1>
          <p>
            {result.student.name} | {result.test.title}
          </p>
        </div>

        <Link to="/admin/reports" className="primary-link-btn">
          Back to Reports
        </Link>
      </div>

      <div className="dashboard-card">
        <div className="info-grid">
          <div>
            <strong>Student</strong>
            <span>{result.student.name}</span>
          </div>

          <div>
            <strong>Email</strong>
            <span>{result.student.email}</span>
          </div>

          <div>
            <strong>Phone</strong>
            <span>{result.student.phone || "-"}</span>
          </div>

          <div>
            <strong>Test</strong>
            <span>{result.test.title}</span>
          </div>

          <div>
            <strong>Subject</strong>
            <span>{result.test.subject}</span>
          </div>

          <div>
            <strong>Module</strong>
            <span>{result.test.module}</span>
          </div>

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
        </div>
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
                  <strong>Student Answer:</strong>{" "}
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
                      ? " ← Student Answer"
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
                      ? " ← Student Answer"
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
                      ? "✅ Student Matched Correctly"
                      : "❌ Student Matched Wrong"}
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

export default AdminResultDetail;
