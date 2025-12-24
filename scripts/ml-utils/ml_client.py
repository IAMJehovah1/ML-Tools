#!/usr/bin/env python3
"""
ML Tools Python Client
A Python client library for interacting with the ML Tools API
"""

import requests
import json
from typing import Dict, List, Any, Optional
from datetime import datetime


class MLToolsClient:
    """Client for interacting with ML Tools API"""
    
    def __init__(self, base_url: str, api_key: Optional[str] = None):
        """
        Initialize the ML Tools client
        
        Args:
            base_url: Base URL of the ML Tools API (e.g., 'http://localhost:3000')
            api_key: Optional API key for authentication
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = requests.Session()
        
        if api_key:
            self.session.headers.update({'Authorization': f'Bearer {api_key}'})
    
    def predict(self, model_id: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run a single prediction
        
        Args:
            model_id: ID of the model to use
            input_data: Input data for prediction
            
        Returns:
            Prediction result
        """
        url = f"{self.base_url}/api/v1/ml/predict"
        payload = {
            'modelId': model_id,
            'input': input_data
        }
        
        response = self.session.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    
    def predict_batch(self, model_id: str, inputs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Run batch predictions
        
        Args:
            model_id: ID of the model to use
            inputs: List of input data for predictions
            
        Returns:
            Batch prediction results
        """
        url = f"{self.base_url}/api/v1/ml/predict-batch"
        payload = {
            'modelId': model_id,
            'inputs': inputs
        }
        
        response = self.session.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    
    def get_active_models(self) -> List[Dict[str, Any]]:
        """
        Get list of all active models
        
        Returns:
            List of active models
        """
        url = f"{self.base_url}/api/v1/ml/models/active"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()['models']
    
    def get_model(self, model_id: str) -> Dict[str, Any]:
        """
        Get details about a specific model
        
        Args:
            model_id: ID of the model
            
        Returns:
            Model details
        """
        url = f"{self.base_url}/api/v1/ml/models/{model_id}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check API health
        
        Returns:
            Health status
        """
        url = f"{self.base_url}/api/v1/ml/health"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()


class ModelManager:
    """Helper class for managing ML models"""
    
    def __init__(self, client: MLToolsClient):
        self.client = client
    
    def list_models(self) -> None:
        """Print list of all active models"""
        models = self.client.get_active_models()
        
        print(f"\n{'='*80}")
        print(f"Active Models ({len(models)})")
        print(f"{'='*80}\n")
        
        for i, model in enumerate(models, 1):
            print(f"{i}. {model['name']} (v{model['version']})")
            print(f"   ID: {model['id']}")
            print(f"   Type: {model['type']}")
            print(f"   Input Shape: {model.get('inputShape', 'N/A')}")
            print(f"   Output Shape: {model.get('outputShape', 'N/A')}")
            print()
    
    def show_model_details(self, model_id: str) -> None:
        """Print detailed information about a model"""
        model = self.client.get_model(model_id)
        
        print(f"\n{'='*80}")
        print(f"Model Details: {model['name']}")
        print(f"{'='*80}\n")
        
        print(f"ID: {model['id']}")
        print(f"Version: {model['version']}")
        print(f"Type: {model['type']}")
        print(f"Framework: {model.get('framework', 'N/A')}")
        print(f"Description: {model.get('description', 'N/A')}")
        print(f"Input Shape: {model.get('inputShape', 'N/A')}")
        print(f"Output Shape: {model.get('outputShape', 'N/A')}")
        print(f"Active: {model.get('active', False)}")
        
        if model.get('metrics'):
            print(f"\nMetrics:")
            for key, value in model['metrics'].items():
                print(f"  {key}: {value}")
        
        print(f"\nCreated: {model.get('createdAt', 'N/A')}")
        print(f"Updated: {model.get('updatedAt', 'N/A')}")
        print()


class PredictionRunner:
    """Helper class for running predictions"""
    
    def __init__(self, client: MLToolsClient):
        self.client = client
    
    def run_prediction(self, model_id: str, input_data: Dict[str, Any], 
                      verbose: bool = True) -> Dict[str, Any]:
        """
        Run a prediction and optionally print results
        
        Args:
            model_id: ID of the model to use
            input_data: Input data for prediction
            verbose: Whether to print results
            
        Returns:
            Prediction result
        """
        result = self.client.predict(model_id, input_data)
        
        if verbose:
            print(f"\n{'='*80}")
            print(f"Prediction Result")
            print(f"{'='*80}\n")
            
            print(f"Model: {result['modelName']} (v{result['modelVersion']})")
            print(f"Timestamp: {result['timestamp']}")
            print(f"\nPrediction:")
            print(f"  Result: {result['prediction']['result']}")
            print(f"  Confidence: {result['prediction']['confidence']:.2%}")
            print(f"  Processing Time: {result['prediction']['processingTime']:.3f}s")
            print()
        
        return result
    
    def run_batch_prediction(self, model_id: str, inputs: List[Dict[str, Any]], 
                            verbose: bool = True) -> Dict[str, Any]:
        """
        Run batch predictions and optionally print results
        
        Args:
            model_id: ID of the model to use
            inputs: List of input data for predictions
            verbose: Whether to print results
            
        Returns:
            Batch prediction results
        """
        result = self.client.predict_batch(model_id, inputs)
        
        if verbose:
            print(f"\n{'='*80}")
            print(f"Batch Prediction Results")
            print(f"{'='*80}\n")
            
            print(f"Model: {result['modelName']} (v{result['modelVersion']})")
            print(f"Batch Size: {result['batchSize']}")
            print(f"Timestamp: {result['timestamp']}")
            print(f"\nPredictions:")
            
            for pred in result['predictions']:
                print(f"  [{pred['index']}] Result: {pred['result']} | "
                      f"Confidence: {pred['confidence']:.2%}")
            print()
        
        return result


# Example usage
if __name__ == '__main__':
    # Initialize client
    client = MLToolsClient('http://localhost:3000')
    
    # Check API health
    try:
        health = client.health_check()
        print(f"API Status: {health['status']}")
        print(f"Version: {health['version']}")
    except Exception as e:
        print(f"Error connecting to API: {e}")
        exit(1)
    
    # List active models
    manager = ModelManager(client)
    manager.list_models()
    
    # Example: Run a prediction (replace with actual model ID)
    # runner = PredictionRunner(client)
    # result = runner.run_prediction(
    #     model_id='your-model-id',
    #     input_data={'data': [1, 2, 3, 4, 5]}
    # )
    
    # Example: Run batch prediction
    # result = runner.run_batch_prediction(
    #     model_id='your-model-id',
    #     inputs=[
    #         {'data': [1, 2, 3]},
    #         {'data': [4, 5, 6]}
    #     ]
    # )
