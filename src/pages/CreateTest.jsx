import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateTest = () => {
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    moduleId: "",
    subject: "",
    durationMinutes: 30
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchModules = async () => {
    try {
      const response = await api.get("/modules");
      setModules(response.data.modules);
    } catch (error) {
      setError("Failed to load modules");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "moduleId") {
      const module = modules.find((item) => item.id === value);
      setSelectedModule(module);
      setForm({
        ...form,
        moduleId: value,
        subject: ""
      });
      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const response = await api.post("/admin/tests", form);

      navigate(`/admin/tests/${response.data.test.id}/questions`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Create Test</h1>
        <p>Create a test and then add questions.</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Test Title</label>
          <input
            type="text"
            name="title"
            placeholder="Example: Science 1 Test 1"
            value={form.title}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Short description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Instructions</label>
          <textarea
            name="instructions"
            placeholder="Example: Attempt all questions. Do not refresh."
            value={form.instructions}
            onChange={handleChange}
          />

          <label>Module</label>
          <select name="moduleId" value={form.moduleId} onChange={handleChange}>
            <option value="">Select module</option>
            {modules.map((module) => (
              <option value={module.id} key={module.id}>
                {module.name}
              </option>
            ))}
          </select>

          <label>Subject</label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            disabled={!selectedModule}
          >
            <option value="">Select subject</option>
            {selectedModule?.subjects.map((subject) => (
              <option value={subject} key={subject}>
                {subject}
              </option>
            ))}
          </select>

          <label>Duration in Minutes</label>
          <input
            type="number"
            name="durationMinutes"
            min="1"
            value={form.durationMinutes}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Test"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;
