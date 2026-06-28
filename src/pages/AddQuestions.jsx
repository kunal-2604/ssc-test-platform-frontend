import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const emptyQuestionForm = {
  questionText: "",
  questionType: "MCQ",
  marks: 1,
  correctAnswer: "",
  explanation: "",
  options: [
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false }
  ],
  matchPairs: [
    { leftText: "", rightText: "", isWrong: false },
    { leftText: "", rightText: "", isWrong: false }
  ]
};

const AddQuestions = () => {
  const { testId } = useParams();

  const [test, setTest] = useState(null);
  const [form, setForm] = useState(emptyQuestionForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTest = async () => {
    try {
      const response = await api.get(`/admin/tests/${testId}`);
      setTest(response.data.test);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, [testId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "questionType") {
      setForm({
        ...emptyQuestionForm,
        questionType: value,
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false }
        ],
        matchPairs: [
          { leftText: "", rightText: "", isWrong: false },
          { leftText: "", rightText: "", isWrong: false }
        ]
      });
      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleOptionTextChange = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index].optionText = value;

    setForm({
      ...form,
      options: updatedOptions
    });
  };

  const handleCorrectOptionChange = (index) => {
    const updatedOptions = form.options.map((option, i) => ({
      ...option,
      isCorrect: i === index
    }));

    setForm({
      ...form,
      options: updatedOptions
    });
  };

  const handlePairChange = (index, field, value) => {
    const updatedPairs = [...form.matchPairs];
    updatedPairs[index][field] = value;

    setForm({
      ...form,
      matchPairs: updatedPairs
    });
  };

  const handleWrongPairChange = (index) => {
    const updatedPairs = form.matchPairs.map((pair, i) => ({
      ...pair,
      isWrong: i === index
    }));

    setForm({
      ...form,
      matchPairs: updatedPairs
    });
  };

  const addPair = () => {
    setForm({
      ...form,
      matchPairs: [
        ...form.matchPairs,
        { leftText: "", rightText: "", isWrong: false }
      ]
    });
  };

  const removePair = (index) => {
    if (form.matchPairs.length <= 2) return;

    setForm({
      ...form,
      matchPairs: form.matchPairs.filter((_, i) => i !== index)
    });
  };

  const resetQuestionForm = () => {
    setForm({
      ...emptyQuestionForm,
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false }
      ],
      matchPairs: [
        { leftText: "", rightText: "", isWrong: false },
        { leftText: "", rightText: "", isWrong: false }
      ]
    });
  };

  const buildPayload = () => {
    const payload = {
      questionText: form.questionText,
      questionType: form.questionType,
      marks: Number(form.marks),
      explanation: form.explanation
    };

    if (form.questionType === "MCQ" || form.questionType === "ODD_ONE_OUT") {
      payload.options = form.options.filter(
        (option) => option.optionText.trim() !== ""
      );
    }

    if (form.questionType === "MATCH_PAIR" || form.questionType === "WRONG_PAIR") {
      payload.matchPairs = form.matchPairs.filter(
        (pair) => pair.leftText.trim() !== "" && pair.rightText.trim() !== ""
      );
    }

    if (["TRUE_FALSE", "CORRELATION", "ONE_WORD", "FILL_BLANK"].includes(form.questionType)) {
      payload.correctAnswer = form.correctAnswer;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const payload = buildPayload();

      const response = await api.post(`/admin/tests/${testId}/questions`, payload);

      setMessage(response.data.message);
      resetQuestionForm();
      await fetchTest();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add question");
    }
  };

  const deleteQuestion = async (questionId) => {
    const confirmDelete = window.confirm("Delete this question?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/admin/tests/questions/${questionId}`);
      setMessage(response.data.message);
      await fetchTest();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading test...</h2>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="page-container">
        <h2>Test not found</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading with-action">
        <div>
          <h1>Add Questions</h1>
          <p>
            {test.title} | {test.module.name} | {test.subject}
          </p>
        </div>

        <Link to="/admin/tests" className="primary-link-btn">
          Back to Tests
        </Link>
      </div>

      {message && <div className="success-box">{message}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="two-column-layout">
        <div className="form-card no-margin">
          <h2>New Question</h2>

          <form onSubmit={handleSubmit}>
            <label>Question Type</label>
            <select
              name="questionType"
              value={form.questionType}
              onChange={handleChange}
            >
              <option value="MCQ">MCQ</option>
              <option value="MATCH_PAIR">Match the Pair</option>
              <option value="ODD_ONE_OUT">Odd One Out</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="WRONG_PAIR">Wrong Pair</option>
              <option value="CORRELATION">Correlation</option>
              <option value="ONE_WORD">Answer in One Word</option>
              <option value="FILL_BLANK">Fill in the Blanks</option>
            </select>

            <label>Question Text</label>
            <textarea
              name="questionText"
              placeholder="Enter question"
              value={form.questionText}
              onChange={handleChange}
            />

            <label>Marks</label>
            <input
              type="number"
              name="marks"
              min="1"
              value={form.marks}
              onChange={handleChange}
            />

            {(form.questionType === "MCQ" || form.questionType === "ODD_ONE_OUT") && (
              <div className="question-section">
                <h3>{form.questionType === "ODD_ONE_OUT" ? "Odd One Out Options" : "Options"}</h3>

                {form.options.map((option, index) => (
                  <div className="option-row" key={index}>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectOptionChange(index)}
                    />

                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option.optionText}
                      onChange={(e) =>
                        handleOptionTextChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}

                <small>
                  {form.questionType === "ODD_ONE_OUT"
                    ? "Select the option that is the odd one out."
                    : "Select the radio button for the correct answer."}
                </small>
              </div>
            )}

            {form.questionType === "TRUE_FALSE" && (
              <div className="question-section">
                <label>Correct Answer</label>
                <select
                  name="correctAnswer"
                  value={form.correctAnswer}
                  onChange={handleChange}
                >
                  <option value="">Select answer</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            )}

            {["CORRELATION", "ONE_WORD", "FILL_BLANK"].includes(
              form.questionType
            ) && (
              <div className="question-section">
                <label>
                  {form.questionType === "CORRELATION" && "Correct Correlation Answer"}
                  {form.questionType === "ONE_WORD" && "Correct One Word Answer"}
                  {form.questionType === "FILL_BLANK" && "Correct Fill in the Blank Answer"}
                </label>

                <input
                  type="text"
                  name="correctAnswer"
                  placeholder="Enter correct answer"
                  value={form.correctAnswer}
                  onChange={handleChange}
                />
              </div>
            )}

            {(form.questionType === "MATCH_PAIR" || form.questionType === "WRONG_PAIR") && (
              <div className="question-section">
                <h3>
                  {form.questionType === "WRONG_PAIR"
                    ? "Enter Pairs and Mark the Wrong Pair"
                    : "Correct Match Pairs"}
                </h3>

                {form.matchPairs.map((pair, index) => (
                  <div
                    className={
                      form.questionType === "WRONG_PAIR"
                        ? "pair-row wrong-pair-row"
                        : "pair-row"
                    }
                    key={index}
                  >
                    {form.questionType === "WRONG_PAIR" && (
                      <input
                        type="radio"
                        name="wrongPair"
                        checked={pair.isWrong}
                        onChange={() => handleWrongPairChange(index)}
                        title="Mark this pair as wrong"
                      />
                    )}

                    <input
                      type="text"
                      placeholder="Left item"
                      value={pair.leftText}
                      onChange={(e) =>
                        handlePairChange(index, "leftText", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Right item"
                      value={pair.rightText}
                      onChange={(e) =>
                        handlePairChange(index, "rightText", e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="small-danger-btn"
                      onClick={() => removePair(index)}
                    >
                      X
                    </button>
                  </div>
                ))}

                <button type="button" className="secondary-btn" onClick={addPair}>
                  Add Pair
                </button>

                <p className="hint-text">
                  {form.questionType === "WRONG_PAIR"
                    ? "Select the radio button beside the pair that is wrong."
                    : "For match the pair, enter the correct left-right matching pairs."}
                </p>
              </div>
            )}

            <label>Explanation</label>
            <textarea
              name="explanation"
              placeholder="Optional explanation"
              value={form.explanation}
              onChange={handleChange}
            />

            <button type="submit">Add Question</button>
          </form>
        </div>

        <div className="question-list-card">
          <h2>
            Questions Added: {test.questions.length} | Marks: {test.totalMarks}
          </h2>

          {test.questions.map((question) => (
            <div className="question-preview" key={question.id}>
              <div className="question-preview-header">
                <strong>
                  Q{question.orderNo}. {question.questionType}
                </strong>

                <span>{question.marks} Mark(s)</span>
              </div>

              <p>{question.questionText}</p>

              {(question.questionType === "MCQ" || question.questionType === "ODD_ONE_OUT") && (
                <ul>
                  {question.options.map((option) => (
                    <li key={option.id}>
                      {option.optionText}{" "}
                      {option.isCorrect
                        ? question.questionType === "ODD_ONE_OUT"
                          ? "✅ Odd One Out"
                          : "✅ Correct"
                        : ""}
                    </li>
                  ))}
                </ul>
              )}

              {["TRUE_FALSE", "CORRELATION", "ONE_WORD", "FILL_BLANK"].includes(
                question.questionType
              ) && <p>Answer: {question.correctAnswer}</p>}

              {(question.questionType === "MATCH_PAIR" || question.questionType === "WRONG_PAIR") && (
                <ul>
                  {question.matchPairs.map((pair) => (
                    <li key={pair.id}>
                      {pair.leftText} → {pair.rightText}{" "}
                      {question.questionType === "WRONG_PAIR" && pair.isWrong ? "❌ Wrong Pair" : ""}
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="small-danger-btn"
                onClick={() => deleteQuestion(question.id)}
              >
                Delete Question
              </button>
            </div>
          ))}

          {test.questions.length === 0 && <p>No questions added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
