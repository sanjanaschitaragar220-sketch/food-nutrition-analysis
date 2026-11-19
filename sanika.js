/**
 * NutriScan AI - Main Application Script
 * Version: 1.0 (PRD Compliant)
 * 
 * Handles:
 * - Image Upload (File selector & Drag-and-drop)
 * - Camera snapshot capture
 * - Sample food catalog loading
 * - Multi-stage AI scanning simulation & progress animations
 * - Optional Live Gemini Vision API integration
 * - Dynamic Macronutrient Chart.js rendering
 * - Portion size scaling (0.5x, 1x, 1.5x, 2x)
 * - FDA Nutrition Label population
 * - Reset and report export functionality
 */

// ============================================================================
// 1. DATASETS & SAMPLES
// ============================================================================

const SAMPLE_FOODS = [
  {
    id: "salmon-bowl",
    name: "Mediterranean Grilled Salmon Bowl",
    category: "Lean Seafood & Whole Grains",
    description: "Pan-seared Atlantic salmon fillet resting on warm tri-color quinoa, roasted broccoli florets, and an extra virgin olive oil drizzle.",
    tags: ["High Protein", "Heart Healthy", "Omega-3", "Gluten-Free"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    confidence: 98,
    healthScore: "A",
    healthDesc: "Nutrient Dense",
    calories: 540,
    protein: 42,
    carbs: 45,
    fat: 22,
    fiber: 7,
    sugar: 3,
    sodium: 360,
    saturatedFat: 3.5,
    cholesterol: 70,
    servingSize: "1 Bowl (approx. 380g)",
    detectedItems: [
      { name: "Atlantic Salmon Fillet", portion: "160g" },
      { name: "Tri-Color Quinoa", portion: "120g" },
      { name: "Steamed Broccoli", portion: "80g" },
      { name: "Extra Virgin Olive Oil", portion: "15ml" },
      { name: "Lemon Herb Glaze", portion: "10ml" }
    ],
    recommendation: "Excellent balance of anti-inflammatory Omega-3 fats, complete plant and marine proteins, and complex carbohydrates. Highly recommended for post-workout recovery or clean dinners."
  },
  {
    id: "burger-fries",
    name: "Double Bacon Cheeseburger & Fries",
    category: "Fast Food / High-Calorie Entree",
    description: "Two grilled beef patties with melted cheddar cheese, crispy bacon rashers, lettuce, and sliced tomatoes, served with salted crinkle-cut fries.",
    tags: ["High Calorie", "High Sodium", "Comfort Food"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    confidence: 96,
    healthScore: "D",
    healthDesc: "High Saturated Fat & Sodium",
    calories: 890,
    protein: 46,
    carbs: 68,
    fat: 48,
    fiber: 4,
    sugar: 9,
    sodium: 1420,
    saturatedFat: 18,
    cholesterol: 135,
    servingSize: "1 Combo Meal (approx. 420g)",
    detectedItems: [
      { name: "Sesame Brioche Bun", portion: "80g" },
      { name: "Ground Beef Patties (x2)", portion: "200g" },
      { name: "Sharp Cheddar Cheese", portion: "40g" },
      { name: "Crispy French Fries", portion: "110g" },
      { name: "Condiments (Mayo/Ketchup)", portion: "25g" }
    ],
    recommendation: "High in energy density, saturated fats, and sodium. Pair with plenty of water and balance the rest of your daily intake with fresh greens and lower-sodium meals."
  },
  {
    id: "avocado-salad",
    name: "Avocado Garden Salad & Poached Egg",
    category: "Fresh Vegetables & Healthy Fats",
    description: "Fresh baby spinach, Hass avocado wedges, organic poached egg, heirloom cherry tomatoes, toasted pumpkin seeds, and citrus vinaigrette.",
    tags: ["Keto Friendly", "Vegetarian", "High Fiber", "Low Glycemic"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    confidence: 97,
    healthScore: "A",
    healthDesc: "Micronutrient Rich",
    calories: 340,
    protein: 12,
    carbs: 18,
    fat: 26,
    fiber: 9,
    sugar: 4,
    sodium: 280,
    saturatedFat: 4.5,
    cholesterol: 185,
    servingSize: "1 Large Salad (approx. 310g)",
    detectedItems: [
      { name: "Hass Avocado Slices", portion: "100g" },
      { name: "Fresh Baby Spinach", portion: "75g" },
      { name: "Poached Free-Range Egg", portion: "50g" },
      { name: "Heirloom Cherry Tomatoes", portion: "60g" },
      { name: "Pumpkin Seeds & Vinaigrette", portion: "25g" }
    ],
    recommendation: "Abundant in monounsaturated fats, lutein, and potassium. Great for stabilizing blood sugar and promoting heart health."
  },
  {
    id: "pepperoni-pizza",
    name: "Artisan Pepperoni & Mozzarella Pizza",
    category: "Italian / Baked Goods",
    description: "Stone-baked sourdough crust topped with spiced tomato passata, whole-milk mozzarella cheese, and Italian pork pepperoni slices.",
    tags: ["High Saturated Fat", "Refined Carbs", "Popular Snack"],
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    confidence: 95,
    healthScore: "C",
    healthDesc: "Moderate Processing",
    calories: 420,
    protein: 18,
    carbs: 46,
    fat: 19,
    fiber: 3,
    sugar: 4,
    sodium: 840,
    saturatedFat: 7.5,
    cholesterol: 45,
    servingSize: "2 Medium Slices (approx. 210g)",
    detectedItems: [
      { name: "Wheat Dough Crust", portion: "120g" },
      { name: "Tomato Herb Sauce", portion: "35g" },
      { name: "Whole-Milk Mozzarella", portion: "45g" },
      { name: "Cured Pepperoni Slices", portion: "30g" }
    ],
    recommendation: "Moderate protein and energy. Consider pairing with a side green salad to boost dietary fiber and slow carbohydrate absorption."
  },
  {
    id: "acai-bowl",
    name: "Organic Acai Berry Smoothie Bowl",
    category: "Fruit & Antioxidant Breakfast",
    description: "Blended organic Brazilian acai berries and frozen bananas, topped with fresh strawberries, blueberries, chia seeds, and coconut flakes.",
    tags: ["Antioxidant Rich", "Dairy Free", "Vegan", "High Fiber"],
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    confidence: 99,
    healthScore: "B",
    healthDesc: "Natural Sugar & Vitamins",
    calories: 310,
    protein: 6,
    carbs: 62,
    fat: 5,
    fiber: 10,
    sugar: 34,
    sodium: 40,
    saturatedFat: 1.2,
    cholesterol: 0,
    servingSize: "1 Bowl (approx. 320g)",
    detectedItems: [
      { name: "Pure Acai Berry Puree", portion: "150g" },
      { name: "Fresh Strawberry Slices", portion: "60g" },
      { name: "Ripe Blueberries", portion: "40g" },
      { name: "Banana Slices", portion: "50g" },
      { name: "Raw Chia Seeds & Coconut", portion: "15g" }
    ],
    recommendation: "Packed with anthocyanins and dietary fiber. Higher natural fruit sugars make this optimal as a pre-workout fuel or morning booster."
  },
  {
    id: "chicken-sweet-potato",
    name: "Grilled Chicken & Roasted Sweet Potato",
    category: "High-Protein Lean Fitness Meal",
    description: "Tender herb-marinated chicken breast, roasted sweet potato cubes with rosemary, and garlic-sautéed green asparagus.",
    tags: ["High Protein", "Lean Gains", "Clean Eating", "Low Fat"],
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    confidence: 97,
    healthScore: "A",
    healthDesc: "Optimal Fitness Fuel",
    calories: 480,
    protein: 52,
    carbs: 40,
    fat: 12,
    fiber: 6,
    sugar: 8,
    sodium: 320,
    saturatedFat: 2.2,
    cholesterol: 95,
    servingSize: "1 Fitness Plate (approx. 350g)",
    detectedItems: [
      { name: "Skinless Chicken Breast", portion: "180g" },
      { name: "Roasted Sweet Potato", portion: "120g" },
      { name: "Charred Green Asparagus", portion: "70g" },
      { name: "Cold-Pressed Olive Oil", portion: "10ml" }
    ],
    recommendation: "The gold standard fitness fuel: exceptionally high protein-to-calorie ratio, vitamin A from sweet potato, and micronutrients from asparagus."
  }
];

// Reference Daily Values (based on 2000 kcal diet)
const DAILY_VALUES = {
  calories: 2000,
  fat: 78,
  saturatedFat: 20,
  cholesterol: 300,
  sodium: 2300,
  carbs: 275,
  fiber: 28,
  protein: 50
};

// ============================================================================
// 2. STATE MANAGEMENT
// ============================================================================

const state = {
  currentImageSource: null,       // Base64 string or sample image URL
  currentFileName: null,          // Name of uploaded file or sample ID
  activeSampleId: null,           // Id of currently selected sample
  activeFoodData: null,           // Raw analyzed food item object
  currentMultiplier: 1.0,         // Portion scaling multiplier
  macroChartInstance: null,       // Chart.js object reference
  geminiApiKey: sessionStorage.getItem("nutriscan_gemini_key") || "",
  cameraStream: null
};

// ============================================================================
// 3. DOM ELEMENTS
// ============================================================================

const dom = {
  // Drop & Upload
  dropZone: document.getElementById("dropZone"),
  fileInput: document.getElementById("fileInput"),
  browseBtn: document.getElementById("browseBtn"),
  cameraBtn: document.getElementById("cameraBtn"),
  
  // Preview
  previewCard: document.getElementById("previewCard"),
  previewImage: document.getElementById("previewImage"),
  scannerOverlay: document.getElementById("scannerOverlay"),
  fileNameLabel: document.getElementById("fileNameLabel"),
  changeImageBtn: document.getElementById("changeImageBtn"),
  analyzeBtn: document.getElementById("analyzeBtn"),
  resetBtn: document.getElementById("resetBtn"),
  resetTopBtn: document.getElementById("resetTopBtn"),
  resetBottomBtn: document.getElementById("resetBottomBtn"),

  // Samples
  sampleGrid: document.getElementById("sampleGrid"),
  
  // Portion Control
  servingControl: document.getElementById("servingControl"),
  servingValue: document.getElementById("servingValue"),
  portionButtons: document.querySelectorAll(".portion-btn"),

  // States
  emptyState: document.getElementById("emptyState"),
  processingState: document.getElementById("processingState"),
  processingStatusText: document.getElementById("processingStatusText"),
  progressBarFill: document.getElementById("progressBarFill"),
  resultsDashboard: document.getElementById("resultsDashboard"),

  // Results Fields
  resultCategory: document.getElementById("resultCategory"),
  resultDescription: document.getElementById("resultDescription"),
  resultTags: document.getElementById("resultTags"),
  confidenceValue: document.getElementById("confidenceValue"),
  aiEngineBadge: document.getElementById("aiEngineBadge"),
  
  // Calories & Health Score
  calTotal: document.getElementById("calTotal"),
  nutriScoreRing: document.getElementById("nutriScoreRing"),
  nutriScoreLetter: document.getElementById("nutriScoreLetter"),
  nutriScoreDesc: document.getElementById("nutriScoreDesc"),

  // 4 Core Macros
  proteinVal: document.getElementById("proteinVal"),
  proteinPct: document.getElementById("proteinPct"),
  proteinBar: document.getElementById("proteinBar"),
  proteinDv: document.getElementById("proteinDv"),

  carbsVal: document.getElementById("carbsVal"),
  carbsPct: document.getElementById("carbsPct"),
  carbsBar: document.getElementById("carbsBar"),
  carbsDv: document.getElementById("carbsDv"),

  fatVal: document.getElementById("fatVal"),
  fatPct: document.getElementById("fatPct"),
  fatBar: document.getElementById("fatBar"),
  fatDv: document.getElementById("fatDv"),

  fiberVal: document.getElementById("fiberVal"),
  fiberBar: document.getElementById("fiberBar"),
  fiberDv: document.getElementById("fiberDv"),

  // Legend
  legendProteinVal: document.getElementById("legendProteinVal"),
  legendCarbsVal: document.getElementById("legendCarbsVal"),
  legendFatVal: document.getElementById("legendFatVal"),

  // FDA Label Elements
  fdaServingSize: document.getElementById("fdaServingSize"),
  fdaCalories: document.getElementById("fdaCalories"),
  fdaFat: document.getElementById("fdaFat"),
  fdaFatDv: document.getElementById("fdaFatDv"),
  fdaSatFat: document.getElementById("fdaSatFat"),
  fdaSatFatDv: document.getElementById("fdaSatFatDv"),
  fdaChol: document.getElementById("fdaChol"),
  fdaCholDv: document.getElementById("fdaCholDv"),
  fdaSodium: document.getElementById("fdaSodium"),
  fdaSodiumDv: document.getElementById("fdaSodiumDv"),
  fdaCarbs: document.getElementById("fdaCarbs"),
  fdaCarbsDv: document.getElementById("fdaCarbsDv"),
  fdaFiber: document.getElementById("fdaFiber"),
  fdaFiberDv: document.getElementById("fdaFiberDv"),
  fdaSugar: document.getElementById("fdaSugar"),
  fdaProtein: document.getElementById("fdaProtein"),
  fdaProteinDv: document.getElementById("fdaProteinDv"),

  // Tabs & Lists
  tabButtons: document.querySelectorAll(".tab-btn"),
  tabPanes: document.querySelectorAll(".tab-pane"),
  detectedItemsGrid: document.getElementById("detectedItemsGrid"),
  dietaryAdviceText: document.getElementById("dietaryAdviceText"),

  // Actions
  printReportBtn: document.getElementById("printReportBtn"),
  copyJsonBtn: document.getElementById("copyJsonBtn"),

  // Modals
  toggleApiKeyBtn: document.getElementById("toggleApiKeyBtn"),
  apiKeyModal: document.getElementById("apiKeyModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  geminiApiKeyInput: document.getElementById("geminiApiKeyInput"),
  saveKeyBtn: document.getElementById("saveKeyBtn"),
  clearKeyBtn: document.getElementById("clearKeyBtn"),
  toggleKeyVisibility: document.getElementById("toggleKeyVisibility"),

  cameraModal: document.getElementById("cameraModal"),
  cameraVideo: document.getElementById("cameraVideo"),
  cameraCanvas: document.getElementById("cameraCanvas"),
  closeCameraBtn: document.getElementById("closeCameraBtn"),
  cancelCaptureBtn: document.getElementById("cancelCaptureBtn"),
  captureSnapshotBtn: document.getElementById("captureSnapshotBtn"),

  // Toast
  toast: document.getElementById("toast"),
  toastMsg: document.getElementById("toastMsg")
};

// ============================================================================
// 4. INITIALIZATION & SETUP
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  renderSampleFoods();
  initEventListeners();
  updateApiKeyStatusUI();

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * Render the 6 sample dishes in the quick selection tray
 */
function renderSampleFoods() {
  dom.sampleGrid.innerHTML = "";

  SAMPLE_FOODS.forEach((food) => {
    const card = document.createElement("div");
    card.className = "sample-card";
    card.dataset.id = food.id;
    card.innerHTML = `
      <div class="sample-thumb-wrap">
        <img src="${food.image}" alt="${food.name}" class="sample-thumb" loading="lazy">
        <span class="sample-cal-pill">${food.calories} kcal</span>
      </div>
      <div class="sample-info">
        <div class="sample-name" title="${food.name}">${food.name}</div>
        <div class="sample-cat">${food.category}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      selectSample(food);
    });

    dom.sampleGrid.appendChild(card);
  });
}

/**
 * Connect all UI event listeners
 */
function initEventListeners() {
  // Drag & Drop
  ["dragenter", "dragover"].forEach(evtName => {
    dom.dropZone.addEventListener(evtName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dom.dropZone.classList.add("drag-active");
    });
  });

  ["dragleave", "drop"].forEach(evtName => {
    dom.dropZone.addEventListener(evtName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dom.dropZone.classList.remove("drag-active");
    });
  });

  dom.dropZone.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleSelectedFile(files[0]);
    }
  });

  // File Selector
  dom.browseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dom.fileInput.click();
  });
  dom.dropZone.addEventListener("click", () => {
    dom.fileInput.click();
  });
  dom.fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSelectedFile(e.target.files[0]);
    }
  });

  // Change Image button
  dom.changeImageBtn.addEventListener("click", () => {
    dom.fileInput.click();
  });

  // Camera Button
  dom.cameraBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openCameraModal();
  });
  dom.closeCameraBtn.addEventListener("click", closeCameraModal);
  dom.cancelCaptureBtn.addEventListener("click", closeCameraModal);
  dom.captureSnapshotBtn.addEventListener("click", captureCameraPhoto);

  // Analyze & Reset
  dom.analyzeBtn.addEventListener("click", triggerAnalysis);
  dom.resetBtn.addEventListener("click", resetAll);
  dom.resetTopBtn.addEventListener("click", resetAll);
  dom.resetBottomBtn.addEventListener("click", resetAll);

  // Portion Multiplier buttons
  dom.portionButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      dom.portionButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const multiplier = parseFloat(btn.dataset.multiplier);
      state.currentMultiplier = multiplier;
      
      const labelMap = {
        0.5: "0.5x (Snack / Half Portion)",
        1.0: "1.0x (Regular / Standard Plate)",
        1.5: "1.5x (Large Portion)",
        2.0: "2.0x (Double Portion)"
      };
      dom.servingValue.textContent = labelMap[multiplier] || `${multiplier}x`;

      if (state.activeFoodData) {
        renderNutritionOutputs(state.activeFoodData, multiplier);
      }
    });
  });

  // Tabs
  dom.tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      dom.tabButtons.forEach(b => b.classList.remove("active"));
      dom.tabPanes.forEach(p => p.classList.remove("active"));
      
      btn.classList.add("active");
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Export Actions
  dom.printReportBtn.addEventListener("click", () => {
    window.print();
  });

  dom.copyJsonBtn.addEventListener("click", copyNutritionJson);

  // API Key Modal
  dom.toggleApiKeyBtn.addEventListener("click", () => {
    dom.apiKeyModal.style.display = "flex";
    dom.geminiApiKeyInput.value = state.geminiApiKey;
  });
  dom.closeModalBtn.addEventListener("click", () => {
    dom.apiKeyModal.style.display = "none";
  });
  dom.toggleKeyVisibility.addEventListener("click", () => {
    const isPass = dom.geminiApiKeyInput.type === "password";
    dom.geminiApiKeyInput.type = isPass ? "text" : "password";
  });
  dom.saveKeyBtn.addEventListener("click", () => {
    const key = dom.geminiApiKeyInput.value.trim();
    state.geminiApiKey = key;
    if (key) {
      sessionStorage.setItem("nutriscan_gemini_key", key);
      showToast("Gemini Vision AI key saved! Real multimodal inference enabled.");
    } else {
      sessionStorage.removeItem("nutriscan_gemini_key");
      showToast("API key cleared. Switched to Neural Simulation.");
    }
    updateApiKeyStatusUI();
    dom.apiKeyModal.style.display = "none";
  });
  dom.clearKeyBtn.addEventListener("click", () => {
    dom.geminiApiKeyInput.value = "";
    state.geminiApiKey = "";
    sessionStorage.removeItem("nutriscan_gemini_key");
    updateApiKeyStatusUI();
    showToast("API key cleared.");
    dom.apiKeyModal.style.display = "none";
  });
}

// ============================================================================
// 5. IMAGE HANDLING & PREVIEW
// ============================================================================

/**
 * Handle user uploaded image file with validation
 */
function handleSelectedFile(file) {
  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file (PNG, JPG, WEBP).", true);
    return;
  }

  // 15MB limit check
  if (file.size > 15 * 1024 * 1024) {
    showToast("File size is too large (Maximum allowed: 15MB).", true);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    displayImagePreview(dataUrl, file.name);
    state.currentImageSource = dataUrl;
    state.currentFileName = file.name;
    state.activeSampleId = null;

    // Unselect any active sample UI highlight
    document.querySelectorAll(".sample-card").forEach(c => c.classList.remove("active"));
  };
  reader.readAsDataURL(file);
}

/**
 * When user selects a sample dish
 */
function selectSample(food) {
  displayImagePreview(food.image, food.name);
  state.currentImageSource = food.image;
  state.currentFileName = food.name;
  state.activeSampleId = food.id;

  // Highlight selected sample card
  document.querySelectorAll(".sample-card").forEach(c => {
    c.classList.toggle("active", c.dataset.id === food.id);
  });

  showToast(`Loaded sample: ${food.name}`);
}

/**
 * Display image inside the preview card and show actions
 */
function displayImagePreview(imageSrc, label) {
  dom.previewImage.src = imageSrc;
  dom.fileNameLabel.textContent = label || "food-image.jpg";
  
  dom.dropZone.style.display = "none";
  dom.previewCard.style.display = "flex";
  dom.resetTopBtn.style.display = "inline-flex";

  // If results were previously shown, transition back to ready-to-analyze state
  if (dom.resultsDashboard.style.display !== "none") {
    dom.resultsDashboard.style.display = "none";
    dom.emptyState.style.display = "flex";
    dom.servingControl.style.display = "none";
  }

  // Scroll to preview smoothly if needed
  dom.previewCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ============================================================================
// 6. CAMERA CAPTURE FUNCTIONALITY
// ============================================================================

async function openCameraModal() {
  dom.cameraModal.style.display = "flex";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    state.cameraStream = stream;
    dom.cameraVideo.srcObject = stream;
  } catch (err) {
    console.error("Camera access error:", err);
    closeCameraModal();
    showToast("Unable to access camera. Please allow camera permissions.", true);
  }
}

function closeCameraModal() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(t => t.stop());
    state.cameraStream = null;
  }
  dom.cameraModal.style.display = "none";
}

function captureCameraPhoto() {
  if (!state.cameraStream) return;
  const video = dom.cameraVideo;
  const canvas = dom.cameraCanvas;
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  
  closeCameraModal();
  displayImagePreview(dataUrl, "camera-snapshot.jpg");
  state.currentImageSource = dataUrl;
  state.currentFileName = "camera-snapshot.jpg";
  state.activeSampleId = null;
  document.querySelectorAll(".sample-card").forEach(c => c.classList.remove("active"));
  showToast("Photo captured successfully!");
}

// ============================================================================
// 7. AI ANALYSIS ORCHESTRATION
// ============================================================================

/**
 * Trigger analysis: simulates scanning or performs live Gemini Vision call
 */
async function triggerAnalysis() {
  if (!state.currentImageSource) {
    showToast("Please upload an image or pick a sample food first.", true);
    return;
  }

  // Set UI state to Processing
  dom.emptyState.style.display = "none";
  dom.resultsDashboard.style.display = "none";
  dom.servingControl.style.display = "none";
  dom.processingState.style.display = "flex";
  dom.scannerOverlay.style.display = "block";
  dom.analyzeBtn.disabled = true;
  dom.analyzeBtn.style.opacity = "0.6";

  // Reset steps
  resetProcessingSteps();

  try {
    let resultData = null;

    if (state.geminiApiKey && state.currentImageSource.startsWith("data:image/")) {
      // User provided live Gemini key and uploaded an image
      resultData = await performLiveGeminiAnalysis(state.currentImageSource, state.geminiApiKey);
    } else {
      // Neural Simulation Mode
      resultData = await simulateNeuralAnalysis();
    }

    // Success: save active data and render
    state.activeFoodData = resultData;
    state.currentMultiplier = 1.0;
    
    // Reset multiplier buttons to 1.0x
    dom.portionButtons.forEach(b => b.classList.toggle("active", b.dataset.multiplier === "1.0"));
    dom.servingValue.textContent = "1.0x (Regular / Standard Plate)";

    // Transition from loading to results
    dom.processingState.style.display = "none";
    dom.scannerOverlay.style.display = "none";
    dom.resultsDashboard.style.display = "flex";
    dom.servingControl.style.display = "block";
    dom.analyzeBtn.disabled = false;
    dom.analyzeBtn.style.opacity = "1";

    renderNutritionOutputs(resultData, 1.0);
    showToast("Nutrition analysis complete!");

    // Refresh Lucide icons in dynamically created elements
    if (window.lucide) window.lucide.createIcons();

  } catch (error) {
    console.error("Analysis failure:", error);
    dom.processingState.style.display = "none";
    dom.scannerOverlay.style.display = "none";
    dom.emptyState.style.display = "flex";
    dom.analyzeBtn.disabled = false;
    dom.analyzeBtn.style.opacity = "1";
    showToast(`Analysis error: ${error.message}`, true);
  }
}

/**
 * Simulates a realistic multi-step AI pipeline with progress bar
 */
function simulateNeuralAnalysis() {
  return new Promise((resolve) => {
    const steps = [
      { id: "step1", pct: 25, text: "Reading Image Pixels & Color Histograms..." },
      { id: "step2", pct: 55, text: "Detecting Ingredients & Culinary Classes..." },
      { id: "step3", pct: 80, text: "Volumetric Density & Calorie Estimation..." },
      { id: "step4", pct: 100, text: "Compiling Macronutrient & Mineral Profiles..." }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        dom.processingStatusText.textContent = step.text;
        dom.progressBarFill.style.width = `${step.pct}%`;
        
        const stepEl = document.getElementById(step.id);
        if (stepEl) {
          stepEl.classList.add("active");
          const prev = steps[currentStep - 1];
          if (prev) {
            const prevEl = document.getElementById(prev.id);
            if (prevEl) {
              prevEl.classList.remove("active");
              prevEl.classList.add("done");
              prevEl.innerHTML = `<i data-lucide="check-circle-2"></i> <span>${prevEl.textContent.trim()}</span>`;
            }
          }
        }
        if (window.lucide) window.lucide.createIcons();
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Determine which food data to return:
        let chosenData = null;

        if (state.activeSampleId) {
          // Exact match to sample
          chosenData = SAMPLE_FOODS.find(f => f.id === state.activeSampleId);
        } else {
          // Heuristic classification based on filename clues
          chosenData = resolveCustomUploadData(state.currentFileName);
        }

        setTimeout(() => {
          resolve(chosenData);
        }, 400);
      }
    }, 450); // Total duration ~1.8 - 2.2 seconds
  });
}

/**
 * Heuristic classifier for custom uploaded photos when offline / no key
 */
function resolveCustomUploadData(fileName = "") {
  const lower = fileName.toLowerCase();

  if (lower.includes("burger") || lower.includes("sandwich") || lower.includes("fastfood") || lower.includes("fries")) {
    return SAMPLE_FOODS[1];
  }
  if (lower.includes("salad") || lower.includes("spinach") || lower.includes("green") || lower.includes("veg")) {
    return SAMPLE_FOODS[2];
  }
  if (lower.includes("pizza") || lower.includes("slice") || lower.includes("cheese") || lower.includes("pie")) {
    return SAMPLE_FOODS[3];
  }
  if (lower.includes("smoothie") || lower.includes("acai") || lower.includes("berry") || lower.includes("fruit") || lower.includes("apple") || lower.includes("bowl")) {
    return SAMPLE_FOODS[4];
  }
  if (lower.includes("chicken") || lower.includes("meat") || lower.includes("steak") || lower.includes("gym") || lower.includes("protein")) {
    return SAMPLE_FOODS[5];
  }
  if (lower.includes("salmon") || lower.includes("fish") || lower.includes("seafood")) {
    return SAMPLE_FOODS[0];
  }

  // General healthy composite dish
  return {
    id: "custom-analyzed-dish",
    name: "Gourmet Chef's Balanced Plate",
    category: "Whole Food Composite Meal",
    description: "Visual analysis identified a balanced combination of lean protein, fibrous seasonal vegetables, and unrefined carbohydrates.",
    tags: ["Balanced Nutrition", "Clean Protein", "Micro-Dense"],
    image: state.currentImageSource,
    confidence: 94,
    healthScore: "A",
    healthDesc: "Balanced Nutrients",
    calories: 510,
    protein: 38,
    carbs: 48,
    fat: 18,
    fiber: 8,
    sugar: 5,
    sodium: 410,
    saturatedFat: 3.0,
    cholesterol: 65,
    servingSize: "1 Custom Plate (approx. 360g)",
    detectedItems: [
      { name: "Identified Lean Protein Cut", portion: "150g" },
      { name: "Complex Carbohydrate Base", portion: "130g" },
      { name: "Mixed Colorful Vegetables", portion: "70g" },
      { name: "Cold-Pressed Herb Dressing", portion: "10ml" }
    ],
    recommendation: "Solid whole-food macronutrient split. Ensure adequate hydration and adjust portion sizing to align with your personal energy expenditure."
  };
}

/**
 * Optional Live Gemini 1.5/2.5 Flash Vision API call
 */
async function performLiveGeminiAnalysis(dataUrl, apiKey) {
  dom.processingStatusText.textContent = "Connecting to Google Gemini Vision AI...";
  dom.progressBarFill.style.width = "40%";

  const base64Data = dataUrl.split(",")[1];
  const mimeType = dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));

  const prompt = `
You are a certified clinical nutritionist and AI computer vision model. Analyze this food image thoroughly and estimate its nutritional values.
Return STRICTLY valid JSON conforming to this schema (do NOT wrap in markdown backticks or commentary):
{
  "name": "Food Dish Name",
  "category": "Culinary Category (e.g. Lean Seafood, Salad, Fast Food, Dessert, Grain Bowl)",
  "description": "2-sentence vivid description of the food item and visual preparation style.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "confidence": 95,
  "healthScore": "A",
  "healthDesc": "Short 2-word health descriptor",
  "calories": 520,
  "protein": 36,
  "carbs": 44,
  "fat": 19,
  "fiber": 7,
  "sugar": 4,
  "sodium": 390,
  "saturatedFat": 3.2,
  "cholesterol": 60,
  "servingSize": "1 Plate (approx. 350g)",
  "detectedItems": [
    {"name": "Ingredient 1", "portion": "150g"},
    {"name": "Ingredient 2", "portion": "80g"}
  ],
  "recommendation": "1-2 sentences of actionable dietary advice for this meal."
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Data } }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const json = await response.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("No response content from Gemini API.");

  // Clean possible markdown code fences
  const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  parsed.isLiveGemini = true;
  return parsed;
}

function resetProcessingSteps() {
  dom.progressBarFill.style.width = "10%";
  const stepIds = ["step1", "step2", "step3", "step4"];
  stepIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.className = "step-item";
      el.innerHTML = `<i data-lucide="circle"></i> <span>${el.textContent.trim()}</span>`;
    }
  });
}

// ============================================================================
// 8. RESULTS RENDERING & MACRO CALCULATIONS
// ============================================================================

/**
 * Render all nutrition outputs scaled by the given multiplier
 */
function renderNutritionOutputs(data, multiplier = 1.0) {
  // Scaled nutritional values
  const cal = Math.round(data.calories * multiplier);
  const protein = Math.round(data.protein * multiplier);
  const carbs = Math.round(data.carbs * multiplier);
  const fat = Math.round(data.fat * multiplier);
  const fiber = Math.round(data.fiber * multiplier);
  const sugar = Math.round(data.sugar * multiplier);
  const sodium = Math.round(data.sodium * multiplier);
  const satFat = Math.round((data.saturatedFat || 0) * multiplier * 10) / 10;
  const chol = Math.round((data.cholesterol || 0) * multiplier);

  // 1. Header Information
  dom.resultCategory.textContent = data.name;
  dom.resultDescription.textContent = `${data.category} &bull; ${data.description}`;
  dom.confidenceValue.textContent = `${data.confidence || 96}%`;
  
  if (data.isLiveGemini) {
    dom.aiEngineBadge.innerHTML = `<i data-lucide="zap"></i> Gemini Live API`;
  } else {
    dom.aiEngineBadge.innerHTML = `<i data-lucide="bot"></i> Neural Simulation`;
  }

  // Tags
  dom.resultTags.innerHTML = "";
  (data.tags || []).forEach(tag => {
    const pill = document.createElement("span");
    pill.className = "food-tag";
    pill.textContent = tag;
    dom.resultTags.appendChild(pill);
  });

  // 2. Calories & Health Score
  dom.calTotal.textContent = cal;
  
  const scoreLetter = (data.healthScore || "A").toUpperCase();
  dom.nutriScoreLetter.textContent = scoreLetter;
  dom.nutriScoreRing.className = `score-ring grade-${scoreLetter.toLowerCase()}`;
  dom.nutriScoreDesc.textContent = data.healthDesc || "Balanced";

  // 3. Macronutrient Energy Breakdown (4 kcal/g for protein & carb, 9 kcal/g for fat)
  const calFromProtein = protein * 4;
  const calFromCarbs = carbs * 4;
  const calFromFat = fat * 9;
  const totalMacroCal = (calFromProtein + calFromCarbs + calFromFat) || 1;

  const pctProtein = Math.round((calFromProtein / totalMacroCal) * 100);
  const pctCarbs = Math.round((calFromCarbs / totalMacroCal) * 100);
  const pctFat = Math.max(0, 100 - pctProtein - pctCarbs);

  // Protein Card
  dom.proteinVal.textContent = protein;
  dom.proteinPct.textContent = `${pctProtein}%`;
  dom.proteinBar.style.width = `${Math.min(100, pctProtein)}%`;
  dom.proteinDv.textContent = `${Math.round((protein / DAILY_VALUES.protein) * 100)}% of Daily Value`;

  // Carbs Card
  dom.carbsVal.textContent = carbs;
  dom.carbsPct.textContent = `${pctCarbs}%`;
  dom.carbsBar.style.width = `${Math.min(100, pctCarbs)}%`;
  dom.carbsDv.textContent = `${Math.round((carbs / DAILY_VALUES.carbs) * 100)}% of Daily Value`;

  // Fat Card
  dom.fatVal.textContent = fat;
  dom.fatPct.textContent = `${pctFat}%`;
  dom.fatBar.style.width = `${Math.min(100, pctFat)}%`;
  dom.fatDv.textContent = `${Math.round((fat / DAILY_VALUES.fat) * 100)}% of Daily Value`;

  // Fiber Card
  dom.fiberVal.textContent = fiber;
  const fiberDv = Math.round((fiber / DAILY_VALUES.fiber) * 100);
  dom.fiberBar.style.width = `${Math.min(100, fiberDv)}%`;
  dom.fiberDv.textContent = `${fiberDv}% of Daily Value`;

  // Legend values
  dom.legendProteinVal.textContent = `${calFromProtein} kcal (${pctProtein}%)`;
  dom.legendCarbsVal.textContent = `${calFromCarbs} kcal (${pctCarbs}%)`;
  dom.legendFatVal.textContent = `${calFromFat} kcal (${pctFat}%)`;

  // 4. Update FDA Nutrition Facts
  dom.fdaServingSize.textContent = multiplier === 1.0 ? data.servingSize : `${data.servingSize} (${multiplier}x portion)`;
  dom.fdaCalories.textContent = cal;
  dom.fdaFat.textContent = `${fat}g`;
  dom.fdaFatDv.textContent = `${Math.round((fat / DAILY_VALUES.fat) * 100)}%`;
  dom.fdaSatFat.textContent = `${satFat}g`;
  dom.fdaSatFatDv.textContent = `${Math.round((satFat / DAILY_VALUES.saturatedFat) * 100)}%`;
  dom.fdaChol.textContent = `${chol}mg`;
  dom.fdaCholDv.textContent = `${Math.round((chol / DAILY_VALUES.cholesterol) * 100)}%`;
  dom.fdaSodium.textContent = `${sodium}mg`;
  dom.fdaSodiumDv.textContent = `${Math.round((sodium / DAILY_VALUES.sodium) * 100)}%`;
  dom.fdaCarbs.textContent = `${carbs}g`;
  dom.fdaCarbsDv.textContent = `${Math.round((carbs / DAILY_VALUES.carbs) * 100)}%`;
  dom.fdaFiber.textContent = `${fiber}g`;
  dom.fdaFiberDv.textContent = `${fiberDv}%`;
  dom.fdaSugar.textContent = `${sugar}g`;
  dom.fdaProtein.textContent = `${protein}g`;
  dom.fdaProteinDv.textContent = `${Math.round((protein / DAILY_VALUES.protein) * 100)}%`;

  // 5. Detected Ingredients Breakdown
  dom.detectedItemsGrid.innerHTML = "";
  (data.detectedItems || []).forEach(item => {
    const chip = document.createElement("div");
    chip.className = "detected-item-chip";
    chip.innerHTML = `
      <i data-lucide="check-circle-2"></i>
      <div class="detected-item-text">
        <span class="item-name">${item.name}</span>
        <span class="item-portion">Estimated: ${item.portion}</span>
      </div>
    `;
    dom.detectedItemsGrid.appendChild(chip);
  });

  // Recommendation
  dom.dietaryAdviceText.textContent = data.recommendation || "Maintain a well-rounded diet with balanced hydration.";

  // 6. Update Donut Chart
  renderMacroChart(calFromProtein, calFromCarbs, calFromFat);
}

/**
 * Render or update the Chart.js Donut Chart
 */
function renderMacroChart(proteinKcal, carbsKcal, fatKcal) {
  const ctx = document.getElementById("macroDonutChart");
  if (!ctx) return;

  if (state.macroChartInstance) {
    state.macroChartInstance.destroy();
  }

  state.macroChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Protein", "Carbohydrates", "Fats"],
      datasets: [{
        data: [proteinKcal, carbsKcal, fatKcal],
        backgroundColor: ["#38bdf8", "#fbbf24", "#f87171"],
        borderColor: "#111827",
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const val = context.raw || 0;
              const pct = Math.round((val / total) * 100);
              return ` ${context.label}: ${val} kcal (${pct}%)`;
            }
          }
        }
      },
      cutout: "70%"
    }
  });
}

// ============================================================================
// 9. UTILITIES & ACTIONS
// ============================================================================

/**
 * Copy JSON Nutrition data to clipboard
 */
function copyNutritionJson() {
  if (!state.activeFoodData) return;

  const exportObj = {
    ...state.activeFoodData,
    appliedMultiplier: state.currentMultiplier,
    calculatedCalories: Math.round(state.activeFoodData.calories * state.currentMultiplier),
    calculatedProteinGrams: Math.round(state.activeFoodData.protein * state.currentMultiplier),
    calculatedCarbsGrams: Math.round(state.activeFoodData.carbs * state.currentMultiplier),
    calculatedFatGrams: Math.round(state.activeFoodData.fat * state.currentMultiplier),
    analyzedAt: new Date().toISOString()
  };

  navigator.clipboard.writeText(JSON.stringify(exportObj, null, 2))
    .then(() => {
      showToast("Nutritional JSON copied to clipboard!");
    })
    .catch(() => {
      showToast("Failed to copy data.", true);
    });
}

/**
 * Reset application state back to clean initial screen
 */
function resetAll() {
  state.currentImageSource = null;
  state.currentFileName = null;
  state.activeSampleId = null;
  state.activeFoodData = null;
  state.currentMultiplier = 1.0;

  dom.fileInput.value = "";
  dom.previewImage.src = "";
  dom.previewCard.style.display = "none";
  dom.dropZone.style.display = "block";
  dom.resetTopBtn.style.display = "none";
  dom.resultsDashboard.style.display = "none";
  dom.servingControl.style.display = "none";
  dom.processingState.style.display = "none";
  dom.emptyState.style.display = "flex";

  document.querySelectorAll(".sample-card").forEach(c => c.classList.remove("active"));
  dom.portionButtons.forEach(b => b.classList.toggle("active", b.dataset.multiplier === "1.0"));

  showToast("Application reset. Ready for a new meal!");
}

/**
 * Updates UI badge for Live Gemini API vs Neural Simulation
 */
function updateApiKeyStatusUI() {
  if (state.geminiApiKey) {
    dom.toggleApiKeyBtn.innerHTML = `<i data-lucide="zap"></i> <span>Gemini Live Active</span>`;
    dom.toggleApiKeyBtn.style.borderColor = "#10b981";
    dom.toggleApiKeyBtn.style.color = "#10b981";
  } else {
    dom.toggleApiKeyBtn.innerHTML = `<i data-lucide="key"></i> <span>Live AI Mode</span>`;
    dom.toggleApiKeyBtn.style.borderColor = "";
    dom.toggleApiKeyBtn.style.color = "";
  }
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Displays a non-intrusive toast notification
 */
let toastTimeout = null;
function showToast(message, isError = false) {
  if (toastTimeout) clearTimeout(toastTimeout);

  dom.toastMsg.textContent = message;
  dom.toast.style.borderColor = isError ? "#ef4444" : "#10b981";
  dom.toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 3200);
}
