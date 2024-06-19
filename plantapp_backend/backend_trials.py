from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from torchvision import models, transforms
import torch
import os
import torch.nn as nn
from PIL import Image
import numpy as np
from openai import OpenAI
import json
from dotenv import load_dotenv

load_dotenv()





app = Flask(__name__)
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OPENAI_API_KEY'] = os.getenv("API_KEY")

client = OpenAI(
    # This is the default and can be omitted
    api_key=app.config['OPENAI_API_KEY'],
)

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# load the CNN model
MODEL_PATH = 'models/(trained on augmented)MobileNetV2_20240531_021014/best_model.pth'
mobilenetv2_base_model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
mobilenetv2_base_model.classifier[1] = nn.Linear(mobilenetv2_base_model.last_channel, 64)
mobilenetv2_base_model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
mobilenetv2_base_model.eval()


classes = ['Apple__black_rot', 'Apple__healthy', 'Apple__rust', 'Apple__scab', 'Cherry__healthy', 'Cherry__powdery_mildew', 'Corn__common_rust',
            'Corn__gray_leaf_spot', 'Corn__healthy', 'Corn__northern_leaf_blight', 'Corn__streak_virus', 'Cucumber__diseased', 'Cucumber__healthy',
              'Grape__black_measles', 'Grape__black_rot', 'Grape__healthy', 'Grape__leaf_blight_(isariopsis_leaf_spot)', 'Peach__bacterial_spot',
                'Peach__healthy', 'Pepper_bell__bacterial_spot', 'Pepper_bell__healthy', 'Potato__early_blight', 'Potato__healthy', 'Potato__late_blight',
                  'Rice__brown_spot', 'Rice__healthy', 'Rice__hispa', 'Rice__leaf_blast', 'Rice__neck_blast', 'Soybean__bacterial_blight', 'Soybean__caterpillar',
                    'Soybean__diabrotica_speciosa', 'Soybean__downy_mildew', 'Soybean__healthy', 'Soybean__powdery_mildew', 'Soybean__rust', 'Soybean__southern_blight',
                      'Strawberry___leaf_scorch', 'Strawberry__healthy', 'Sugarcane__bacterial_blight', 'Sugarcane__healthy', 'Sugarcane__red_rot', 'Sugarcane__red_stripe',
                        'Sugarcane__rust', 'Tea__algal_leaf', 'Tea__anthracnose', 'Tea__bird_eye_spot', 'Tea__brown_blight', 'Tea__healthy', 'Tea__red_leaf_spot', 'Tomato__bacterial_spot',
                          'Tomato__early_blight', 'Tomato__healthy', 'Tomato__late_blight', 'Tomato__leaf_mold', 'Tomato__mosaic_virus', 'Tomato__septoria_leaf_spot',
                            'Tomato__spider_mites_(two_spotted_spider_mite)', 'Tomato__target_spot', 'Tomato__yellow_leaf_curl_virus', 'Wheat__brown_rust', 'Wheat__healthy',
                              'Wheat__septoria', 'Wheat__yellow_rust']

plant_to_onehot = {'Apple': [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],'Cherry': [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
'Corn': [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],'Cucumber': [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
'Grape': [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],'Peach': [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
'Pepper_bell': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],'Potato': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
'Rice': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],'Soybean': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0],
'Strawberry': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],'Sugarcane': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0],
'Tea': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],'Tomato': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],
'Wheat': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]}

transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

def api_call(language, plant_name, sickness):
    systemPrompt = "You are a plant disease expert. You will be given a specific disease of some plant. You need to explain the root cause of the disease, the symptoms, the treatment process (in detail), and the preventive measures. Your explanation needs to be understood by anyone. Also give a severity point between 1-5, 5 being the most fatal. Give the response in JSON format in this format, do not add extra subfields, follow the format strictly: {explanation:{root_cause:..., symptoms:..., treatment_process:..., preventive_measures:...}, severity:...}"
    if language == "tr":
        systemPrompt = "You are a plant disease expert. You will be given a specific disease of some plant. You need to explain the root cause of the disease, the symptoms, the treatment process (in detail), and the preventive measures. Your explanation needs to be understood by anyone. Also give a severity point between 1-5, 5 being the most fatal. Your content must be in Turkish (excluding json fields they must be exactly as it is given). Give the response in JSON format in this format, do not add extra subfields, follow the format strictly: {explanation:{root_cause:..., symptoms:..., treatment_process:..., preventive_measures:...}, severity:...}"
    
    try:
        response = client.chat.completions.create(
            model = "gpt-4o",
            response_format={ "type": "json_object" },
            messages = [
                {"role": "system", "content": systemPrompt},
                {"role": "user", "content": f"I found out that my {plant_name} suffers from {sickness}. Enlighten me."}
            ]
        )
        description = json.loads(response.choices[0].message.content)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    circuit_breaker = 0
    while "explanation" not in description or "severity" not in description and circuit_breaker < 3:
        try:
            response = client.chat.completions.create(
                model = "gpt-4o",
                response_format={ "type": "json_object" },
                messages = [
                    {"role": "system", "content": systemPrompt},
                    {"role": "user", "content": f"I found out that my {plant_name} suffers from {sickness}. Enlighten me."}
                ]
            )
            description = json.loads(response.choices[0].message.content)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

        circuit_breaker += 1
    
    return description

def find_labels_by_plant_name(plant_name, class_names):
    labels = []
    for i, class_name in enumerate(class_names):
        if class_name.split("__")[0] == plant_name:
            labels.append(i)
    return labels 

@app.route('/predict', methods=['POST'])
def predict():
    # get the plant type from the request or set it to General

    plant_type = request.form.get('plant_type', 'General')
    language =  request.form.get("language", "eng")
    
    print(language)

    # load the image from the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files.get('file')

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Image preprocessing
    image = Image.open(file_path).convert('RGB')
    image = transform(image).unsqueeze(0)
    image = image.to(device)

    # Get the probability distribution from the CNN model
    with torch.no_grad():
        cnn_output = mobilenetv2_base_model(image)
        #cnn_output = cnn_output.cpu().detach().numpy().flatten()

    # Prune the output based on the plant type if plant type it is specified
    if plant_type != 'General':
        print(f"type specified: {plant_type}")
        possible_labels = find_labels_by_plant_name(plant_type, classes) # get the possible labels for the specific plant type
        output = cnn_output[:, possible_labels]
        _, predicted_pruned_index = torch.max(output, 1)
        predicted_class_index = possible_labels[predicted_pruned_index.item()]
        prediction = classes[predicted_class_index]
        
        
    else:
        prediction = np.argmax(cnn_output)
        prediction = classes[prediction]
        print("type didnt specified")
    
    plant_name = prediction.split("__")[0].replace("_", " ").title()
    sickness = prediction.split("__")[1].replace("_", " ").title()
    
    if not sickness.lower() == "healthy":
        description = api_call(language=language, plant_name=plant_name, sickness=sickness)
        
        return jsonify({'data': {"plant_name":plant_name ,"prediction": sickness, "description": description["explanation"], "severity": description["severity"]}})

    return jsonify({'data': {"plant_name":plant_name ,"prediction": sickness}})
    

"""@app.route('/disease_info', methods=['GET'])
def disease_info():
    disease_name = request.args.get('disease_name')
    if not disease_name:
        return jsonify({'error': 'No disease name provided'}), 400
    
    try:
        response = client.chat.completions.create(
            model = "gpt-4-turbo",
            messages = [
                {"role": "system", "content": "You've mentioned that your plant is suffering from [specific plant disease]. This disease typically affects [type of plant] and can lead to [symptoms]. To treat this, I recommend [specific treatment or cure], which includes [detailed steps or products to use]. Ensure you follow [care instructions, like watering or sunlight needs], to support recovery. For prevention, consider [preventive measures]."},
                {"role": "user", "content": f"Tell me about {disease_name}."}
            ]
        )
        description = response.choices[0].message.content

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    # Return the generated description
    return jsonify({'disease': disease_name, 'description': description})"""

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)