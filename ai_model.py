import sys
import json
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Load user input from Node.js
if len(sys.argv) > 1:
    try:
        user_input = json.loads(sys.argv[1])
        
        # Load the dataset
        dataset_path = "./Refined_Skincare_Dataset.csv"
        data = pd.read_csv(dataset_path)
        
        # Preprocess the dataset
        label_encoders = {}
        for column in ['Gender', 'Age Range', 'Skin Type', 'Skin Concern', 'Skin Sensitivity', 'Allergic Issue']:
            label_encoders[column] = LabelEncoder()
            data[column] = label_encoders[column].fit_transform(data[column])
        
        # Train the model
        X = data[['Gender', 'Age Range', 'Skin Type', 'Skin Concern', 'Skin Sensitivity', 'Allergic Issue']]
        y = data['Recommended Products']
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # Map frontend keys to dataset keys (identity mapping since controller already sends correct keys)
        key_mapping = {
            'Gender': 'Gender',
            'Age Range': 'Age Range',
            'Skin Type': 'Skin Type',
            'Skin Concern': 'Skin Concern',
            'Skin Sensitivity': 'Skin Sensitivity',
            'Allergic Issue': 'Allergic Issue'
        }
        
        # Handle "None" or empty values for allergy issues
        if user_input.get('Allergic Issue') == 'None' or user_input.get('Allergic Issue') == '' or user_input.get('Allergic Issue') is None:
            user_input['Allergic Issue'] = 'Contact Dermatitis'  # Default to a valid value
        
        # Preprocess user input and create DataFrame
        prediction_data = {}
        for frontend_key, value in user_input.items():
            if frontend_key in key_mapping:
                dataset_key = key_mapping[frontend_key]
                try:
                    encoded_value = label_encoders[dataset_key].transform([value])[0]
                    prediction_data[dataset_key] = [encoded_value]
                except ValueError as e:
                    print(json.dumps({"error": f"Invalid value '{value}' for {dataset_key}. Valid values: {list(label_encoders[dataset_key].classes_)}"}))
                    sys.exit(1)
        
        # Ensure we have all required columns
        if len(prediction_data) == 6:  # All 6 columns should be present
            user_df = pd.DataFrame(prediction_data)
            prediction = model.predict(user_df)
            
            # Return the prediction as JSON
            print(json.dumps({"recommended_product": prediction[0]}))
        else:
            print(json.dumps({"error": f"Missing columns. Expected 6, got {len(prediction_data)}. Data: {prediction_data}"}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({"error": f"Python script error: {str(e)}"}))
        sys.exit(1)
else:
    print(json.dumps({"error": "No input provided"})) 