import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Animal Classifier 🐾</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleSubmit} disabled={!image}>
        Predict
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Natija:</h2>
          <p>
            <strong>Klass:</strong> {result.predicted_class}
          </p>
          <p>
            <strong>Ehtimollik:</strong> {Math.round(result.probability * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
