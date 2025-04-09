import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AnalyzePatient.css';

const AnalyzePatient = () => {
    const { patientId } = useParams();
    const [selectedModel, setSelectedModel] = useState('1');
    const [imageFile, setImageFile] = useState(null);
    const [result, setResult] = useState(null);
    const [pdfLink, setPdfLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        setResult(null);
        setPdfLink('');
    };

    const handleImageUpload = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAnalyze = async () => {
        if (!imageFile) {
            return setError('Please upload an image first');
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const uploadForm = new FormData();
            uploadForm.append('image', imageFile);

            // Upload the image
            await axios.post(
                `http://localhost:8000/api/doctors/uploadImage/${patientId}`,
                uploadForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Analyze the image
            const res = await axios.post(
                'http://localhost:8000/api/doctors/analyzeImage',
                {
                    patientId,
                    modelNumber: selectedModel,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setResult(res.data);
            setPdfLink(`http://localhost:8000/${res.data.pdf_report}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analyze-container">
            <h2>Analyze Patient Image</h2>

            <div className="model-selector">
                <label>Select Model:</label>
                <select value={selectedModel} onChange={handleModelChange}>
                    <option value="1">Pneumonia Detection</option>
                    <option value="2">DR Detection</option>
                    <option value="3">Tuberculosis Detection</option>
                </select>
            </div>

            <div className="upload-section">
                <label>Upload Image:</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

            <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {error && <div className="error">{error}</div>}

            {result && (
                <div className="result-box">
                    <h3>Prediction Result</h3>
                    <p><strong>Model:</strong> {result.model}</p>
                    <p><strong>Label:</strong> {result.predicted_label}</p>
                    {/* <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p> */}
                    <a href={pdfLink} download className="download-report-btn">📥 Download Report</a>
                </div>
            )}
        </div>
    );
};

export default AnalyzePatient;
