/**
 * Model Configuration
 * 
 * This file contains configuration for integrating your custom prediction model.
 * Update the API endpoint and parameters based on your model setup.
 */

export const MODEL_CONFIG = {
  // Replace with your actual model API endpoint
  API_ENDPOINT: process.env.VITE_MODEL_API_URL || 'http://localhost:5000/api/predict',
  
  // Model input parameters - customize based on your model
  INPUT_PARAMETERS: {
    rainfall: {
      name: 'Annual Rainfall',
      unit: 'mm',
      min: 0,
      max: 500,
      description: 'Current season precipitation'
    },
    laggedRainfall: {
      name: 'Lagged Rainfall',
      unit: 'mm',
      min: 0,
      max: 500,
      description: 'Previous period rainfall'
    },
    discharge: {
      name: 'Peak Discharge',
      unit: 'm³/s',
      min: 0,
      max: 15000,
      description: 'Maximum water flow rate'
    },
    treeLoss: {
      name: 'Tree Loss',
      unit: '%',
      min: 0,
      max: 100,
      description: 'Deforestation rate'
    },
    catchmentArea: {
      name: 'Catchment Area',
      unit: 'km²',
      min: 0,
      max: 50000,
      description: 'Drainage basin size'
    }
  },

  // Model output configuration
  OUTPUT_FORMAT: {
    riskLevel: ['Low', 'Moderate', 'High', 'Critical'],
    probabilityRange: [0, 100],
    includeShap: true, // Set to true if your model returns SHAP values
  },

  // Timeout for API requests (in milliseconds)
  REQUEST_TIMEOUT: 30000,

  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * Function to call your prediction model
 * Modify this to match your model's API format
 */
export async function callPredictionModel(inputs) {
  try {
    const response = await fetch(MODEL_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      throw new Error(`Model API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Model prediction error:', error);
    throw error;
  }
}

/**
 * Function to get state-level predictions for the map
 * Modify based on your model's state prediction endpoint
 */
export async function getStateRiskPredictions() {
  try {
    const response = await fetch(`${MODEL_CONFIG.API_ENDPOINT}/states`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`State predictions API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('State predictions error:', error);
    throw error;
  }
}
