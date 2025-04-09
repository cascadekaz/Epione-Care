import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2
from PIL import Image
import io
import base64

# Class labels
class_labels = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR"
}

# Fundus Preprocessing Classes (copied from your working code)
class TFRecord:
    @staticmethod
    def image_to_tfrecord(image):
        if not tf.is_tensor(image):
            image = tf.convert_to_tensor(image, dtype=tf.uint8)
        if len(image.shape) == 2:
            image = tf.expand_dims(image, axis=-1)
            image = tf.image.grayscale_to_rgb(image)
        elif image.shape[-1] != 3:
            raise ValueError("Input image must have 3 channels (RGB).")
        image_raw = tf.io.encode_jpeg(image).numpy()
        feature = {'image_raw': tf.train.Feature(bytes_list=tf.train.BytesList(value=[image_raw]))}
        example = tf.train.Example(features=tf.train.Features(feature=feature))
        return example.SerializeToString()

    @staticmethod
    def parse_tfrecord(tfrecord):
        feature_description = {'image_raw': tf.io.FixedLenFeature([], tf.string)}
        parsed = tf.io.parse_single_example(tfrecord, feature_description)
        image = tf.io.decode_image(parsed['image_raw'], channels=3)
        image = tf.image.resize(image, (224, 224))
        image = image / 255.0
        return tf.expand_dims(image, axis=0)

class FundusROIextractor:
    def __init__(self, target_diameter=900, threshold_ratio=0.05, circular_diameter=6):
        self.target_diameter = target_diameter
        self.threshold_ratio = threshold_ratio
        self.circular_diameter = circular_diameter

    def extract_green_channel(self, image):
        return image[:, :, 1]

    def apply_global_threshold(self, image):
        max_intensity = np.max(image)
        threshold_value = int(self.threshold_ratio * max_intensity)
        _, threshold_image = cv2.threshold(image, threshold_value, 255, cv2.THRESH_BINARY)
        return threshold_image

    def morphological_operations(self, image):
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        opened = cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)
        closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel)
        return closed

    def resize_roi(self, image):
        h, w = image.shape
        current_diameter = min(h, w)
        scale_factor = self.target_diameter / current_diameter
        new_size = (int(w * scale_factor), int(h * scale_factor))
        return cv2.resize(image, new_size, interpolation=cv2.INTER_CUBIC)

    def circular_corrosion(self, image):
        struct_element = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (self.circular_diameter, self.circular_diameter))
        return cv2.erode(image, struct_element)

    def apply_mask(self, image, mask):
        if mask.shape != image.shape:
            mask = cv2.resize(mask, (image.shape[1], image.shape[0]), interpolation=cv2.INTER_NEAREST)
        return cv2.bitwise_and(image, image, mask=mask.astype(np.uint8))

    def process(self, image):
        green = self.extract_green_channel(image)
        thresh = self.apply_global_threshold(green)
        morph = self.morphological_operations(thresh)
        resized = self.resize_roi(morph)
        corroded = self.circular_corrosion(resized)
        return self.apply_mask(green, corroded)

class IlluminationEqualizer:
    def __init__(self, filter_size=3, normalization_filter_size=20):
        self.filter_size = filter_size
        self.normalization_filter_size = normalization_filter_size

    def normalize_image(self, image):
        min_val = np.min(image)
        clipped = image - min_val
        return cv2.normalize(clipped, None, 0, 255, cv2.NORM_MINMAX)

class HistogramEqualizer:
    def equalize_histogram(self, image):
        return cv2.equalizeHist(image)

class AdaptiveHistogram:
    def __init__(self, clip_limit=2.0, tile_grid_size=(8, 8)):
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)

    def apply_clahe(self, image):
        return self.clahe.apply(image)

class FundusPreprocessor:
    def __init__(self, target_diameter=900, threshold_ratio=0.05, circular_diameter=6, filter_size=3, normalization_filter_size=20):
        self.roi_extractor = FundusROIextractor(target_diameter, threshold_ratio, circular_diameter)
        self.illumination_equalizer = IlluminationEqualizer(filter_size, normalization_filter_size)
        self.hist_eq = HistogramEqualizer()
        self.ad_hist = AdaptiveHistogram()

    def process(self, image):
        roi = self.roi_extractor.process(image)
        normalized = self.illumination_equalizer.normalize_image(roi)
        hist = self.hist_eq.equalize_histogram(normalized)
        ad = self.ad_hist.apply_clahe(hist)
        return ad

# Initialize model and preprocessor
model_path = "C:/Users/KIIT/Documents/MinorProject/minor_modeldeploy/models/model_l2/best_model.keras"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

model = load_model(model_path)
print(f"Model loaded successfully. Input shape: {model.input_shape}")

preprocessor = FundusPreprocessor()

def preprocess_image_with_tfrecord(file: bytes):
    img = Image.open(io.BytesIO(file)).convert("RGB")
    np_img = np.array(img)
    preprocessed_img = preprocessor.process(np_img)
    serialized = TFRecord.image_to_tfrecord(preprocessed_img)
    tf_input = TFRecord.parse_tfrecord(serialized)
    return tf_input, preprocessed_img

# Prediction Function
def predict_disease(file: bytes):
    try:
        input_image, preprocessed_image = preprocess_image_with_tfrecord(file)
        prediction = model.predict(input_image)
        predicted_class = np.argmax(prediction)
        confidence = float(np.max(prediction))
        label = class_labels.get(predicted_class, "Unknown")

        # Convert preprocessed image (grayscale) to base64
        resized = cv2.resize(preprocessed_image, (224, 224))
        _, encoded_image = cv2.imencode('.jpg', resized)
        img_base64 = base64.b64encode(encoded_image).decode("utf-8")

        return {
            "model": "Diabetic Retinopathy Detection",
            "label": label,
            "confidence": confidence,
            "preprocessed_image": img_base64
        }

    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}
