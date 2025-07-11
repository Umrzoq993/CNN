import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setResult(null);
    setPreview(URL.createObjectURL(file));
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
    <div className="container">
      <h1>🐾 Animal Classifier</h1>

      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img src={preview} alt="Preview" className="preview-image" />
        )}
        <button onClick={handleSubmit} disabled={!image}>
          Predict
        </button>
      </div>

      {result && (
        <div className="result-box">
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
