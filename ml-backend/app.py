# python -m venv myenv 
# myenv\Scripts\activate
# pip install -r .\requirements.txt
# python app.py
from flask import Flask, request, jsonify
import numpy as np
import pickle
import pandas as pd

app = Flask(__name__)

# Load Earthquake model, scaler, and feature names
with open("earthquake_classifier.pkl", "rb") as f:
    earthquake_model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("feature_names.pkl", "rb") as f:
    eq_features = pickle.load(f)

scale_cols = ['longitude', 'latitude', 'depth', 'significance', 'loc_depth', 'sig_depth']

# Load Flood CatBoost model
with open("catboost_model.pkl", "rb") as f:
    flood_model = pickle.load(f)

@app.route('/api/predict_earthquake', methods=['POST'])
def predict_earthquake():
    try:
        data = request.get_json()

        required_fields = ['significance', 'longitude', 'latitude', 'depth']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        tsunami = int(data.get('tsunami', 0))
        significance = float(data['significance'])
        longitude = float(data['longitude'])
        latitude = float(data['latitude'])
        depth = float(data['depth'])
        year = 2025

        year_bin = pd.cut([year], bins=[1990, 2000, 2010, 2020, 2030], labels=False)[0]
        loc_depth = latitude * depth
        sig_depth = significance * depth

        input_dict = {
            'tsunami': tsunami,
            'significance': significance,
            'longitude': longitude,
            'latitude': latitude,
            'depth': depth,
            'year': year,
            'year_bin': year_bin,
            'loc_depth': loc_depth,
            'sig_depth': sig_depth
        }

        input_row = np.array([[input_dict[feat] for feat in eq_features]])
        scale_indices = [eq_features.index(col) for col in scale_cols]
        scaled_part = scaler.transform(input_row[:, scale_indices])
        input_row[0, scale_indices] = scaled_part

        prediction = earthquake_model.predict(input_row)[0]
        result = "Earthquake Likely!" if prediction == 1 else "No Earthquake Expected."

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": f"Error in Earthquake Prediction: {e}"}), 500

@app.route('/api/predict_flood', methods=['POST'])
def predict_flood():
    try:
        data = request.get_json()

        required_fields = [
            'MonsoonIntensity', 'TopographyDrainage', 'RiverManagement', 'Deforestation', 'Urbanization',
            'ClimateChange', 'DamsQuality', 'Siltation', 'AgriculturalPractices', 'Encroachments',
            'IneffectiveDisasterPreparedness', 'DrainageSystems', 'CoastalVulnerability', 'Landslides',
            'Watersheds', 'DeterioratingInfrastructure', 'PopulationScore', 'WetlandLoss',
            'InadequatePlanning', 'PoliticalFactors'
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        input_data = {feat: float(data[feat]) for feat in required_fields}
        input_df = pd.DataFrame([input_data])

        prediction = flood_model.predict(input_df)[0]
        result = f"Predicted Flood Severity: {round(prediction, 2)}"

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": f"Error in Flood Prediction: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
