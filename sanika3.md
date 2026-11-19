# NutriScan AI - AI-Based Food Nutrition Analysis System (v1.0)

A web application designed to automatically estimate food categories and nutritional values (calories, protein, carbohydrates, fats, fiber, sodium, etc.) from food photography, sample plates, or live camera snapshots.

---

## 🌟 Features Implemented (PRD Compliant)

1. **Image Upload & Input Flexibility**:
   - **Drag & Drop**: Native drag-and-drop zone with visual hover states and file validation (JPG, PNG, WEBP up to 15MB).
   - **Device File Selector**: Browse and select images directly from your computer or phone.
   - **Live Camera Capture**: Real-time snapshot capture from your webcam/mobile camera.
   - **Sample Food Tray (1-Click Instant Load)**: 6 pre-configured culinary plates (Mediterranean Salmon Bowl, Double Cheeseburger & Fries, Avocado Salad & Egg, Artisan Pepperoni Pizza, Acai Berry Bowl, Grilled Herb Chicken & Sweet Potato).

2. **Image Preview & Visual Feedback**:
   - Instant image preview powered by the HTML5 `FileReader` API.
   - **Computer Vision Scanning Overlay**: Laser animation and segmentation grid during analysis to simulate deep learning object recognition.
   - Dynamic file name and metadata badge.

3. **Nutritional Output**:
   - **Food Category & Confidence**: Identifies culinary category with percentage confidence score.
   - **Calorie Spotlight**: Large energy display in kcal with Nutri-Score / Health Grade (A to E).
   - **4 Core Macronutrients**:
     - **Calories** (kcal)
     - **Protein** (g) & % Daily Value
     - **Carbohydrates** (g) & % Daily Value
     - **Total Fat** (g) & % Daily Value
     - **Dietary Fiber** (g) & % Daily Value
   - **Interactive Chart.js Donut Chart**: Visualizes caloric distribution between protein, carbohydrates, and fats.
   - **FDA-Compliant Nutrition Facts Label**: Authentic Nutrition Facts panel with saturated fat, cholesterol, sodium, sugars, and % Daily Values based on a 2,000 kcal reference diet.
   - **Detected Ingredients List**: Segmented component items with estimated portion sizes.
   - **Nutritionist Recommendation**: Actionable dietary advice for each analyzed meal.

4. **Dynamic Portion Size Scaler**:
   - Easily scale the portion (0.5x Snack, 1.0x Regular, 1.5x Large, 2.0x Double) and watch all calories, macros, and FDA label numbers update dynamically in real time.

5. **AI Modes**:
   - **Smart Neural Simulation (Offline / Zero Friction)**: Works 100% out of the box with zero setup using USDA FoodData Central reference values and smart filename heuristic detection.
   - **Optional Live Google Gemini Vision API**: Allows users to enter their own Gemini API key in the settings modal to perform live multimodal vision inference on any arbitrary food photo.

6. **Export & Reset**:
   - **Reset**: Instantly clear image and analysis to start fresh.
   - **Print / PDF Summary**: Formatted print layout to print or save a clean nutrition report.
   - **Copy JSON**: Export the nutritional data schema directly to the clipboard.

---

## 🚀 How to Run the Website

Since NutriScan AI is built strictly using **HTML5, CSS3, and modern vanilla JavaScript (ES6+)**, there are no complex installation steps or build pipelines required!

### Option 1: Direct Browser Opening (Easiest)
1. Open your File Explorer.
2. Navigate to: `c:\Users\suresh\OneDrive\Attachments\`
3. Double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Live Server / HTTP Server (Optional)
If you prefer running via a local web server:
- With Python (if installed):
  ```bash
  python -m http.server 8080
  ```
- Or with VS Code / IDE: Right-click `index.html` and click **"Open with Live Server"**.

---

## 📁 File Structure

```
c:\Users\suresh\OneDrive\Attachments\
├── index.html       # Semantic HTML5 layout, modals, preview & results panels
├── styles.css       # Responsive CSS3 styling, glassmorphism, scan laser animation
├── app.js           # ES6+ app logic, Chart.js integration, mock engine, Gemini API
└── README.md        # Documentation and verification guide
```
