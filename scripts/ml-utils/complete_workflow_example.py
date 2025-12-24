#!/usr/bin/env python3
"""
Complete ML Workflow Example
Demonstrates a full ML workflow using the ML Tools platform
"""

import json
import numpy as np
from pathlib import Path
import sys

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

from ml_client import MLToolsClient, ModelManager, PredictionRunner


def generate_sample_data(n_samples=100):
    """Generate sample data for demonstration"""
    np.random.seed(42)
    
    # Generate random features
    X = np.random.randn(n_samples, 4)
    
    # Generate random labels (3 classes)
    y = np.random.randint(0, 3, size=n_samples)
    
    return X, y


def demonstrate_workflow():
    """Demonstrate complete ML workflow"""
    
    print("="*80)
    print("ML Tools Complete Workflow Demonstration")
    print("="*80)
    print()
    
    # Step 1: Initialize client
    print("Step 1: Initializing ML Tools client...")
    client = MLToolsClient('http://localhost:3000')
    
    # Check health
    try:
        health = client.health_check()
        print(f"✓ API Health: {health['status']}")
        print(f"✓ API Version: {health['version']}")
    except Exception as e:
        print(f"✗ Failed to connect to API: {e}")
        print("Make sure the ML Tools platform is running:")
        print("  npm run dev")
        return
    
    print()
    
    # Step 2: List available models
    print("Step 2: Checking available models...")
    manager = ModelManager(client)
    
    try:
        models = client.get_active_models()
        if models:
            print(f"✓ Found {len(models)} active model(s)")
            for model in models:
                print(f"  - {model['name']} (v{model['version']}) - ID: {model['id']}")
        else:
            print("! No active models found")
            print("  Please create and activate a model in the dashboard:")
            print("  http://localhost:3000/")
            return
    except Exception as e:
        print(f"✗ Error listing models: {e}")
        return
    
    print()
    
    # Step 3: Select a model
    print("Step 3: Selecting model for inference...")
    selected_model = models[0]
    model_id = selected_model['id']
    print(f"✓ Selected: {selected_model['name']} (v{selected_model['version']})")
    print()
    
    # Step 4: Show model details
    print("Step 4: Retrieving model details...")
    try:
        model_details = client.get_model(model_id)
        print(f"✓ Model Type: {model_details['type']}")
        print(f"✓ Framework: {model_details.get('framework', 'N/A')}")
        print(f"✓ Input Shape: {model_details.get('inputShape', 'N/A')}")
        print(f"✓ Output Shape: {model_details.get('outputShape', 'N/A')}")
        
        if model_details.get('metrics'):
            print("✓ Performance Metrics:")
            for key, value in model_details['metrics'].items():
                if value:
                    print(f"    {key}: {value}")
    except Exception as e:
        print(f"✗ Error getting model details: {e}")
    
    print()
    
    # Step 5: Generate sample data
    print("Step 5: Generating sample test data...")
    X_test, y_test = generate_sample_data(n_samples=10)
    print(f"✓ Generated {len(X_test)} test samples")
    print(f"✓ Sample shape: {X_test[0].shape}")
    print()
    
    # Step 6: Single prediction
    print("Step 6: Running single prediction...")
    runner = PredictionRunner(client)
    
    try:
        sample_input = X_test[0].tolist()
        print(f"  Input: {sample_input}")
        
        result = runner.run_prediction(
            model_id=model_id,
            input_data={'data': sample_input},
            verbose=False
        )
        
        print(f"✓ Prediction: {result['prediction']['result']}")
        print(f"✓ Confidence: {result['prediction']['confidence']:.2%}")
        print(f"✓ Processing Time: {result['prediction']['processingTime']:.3f}s")
    except Exception as e:
        print(f"✗ Prediction failed: {e}")
    
    print()
    
    # Step 7: Batch predictions
    print("Step 7: Running batch predictions...")
    
    try:
        batch_inputs = [{'data': x.tolist()} for x in X_test[:5]]
        print(f"  Batch size: {len(batch_inputs)}")
        
        result = runner.run_batch_prediction(
            model_id=model_id,
            inputs=batch_inputs,
            verbose=False
        )
        
        print(f"✓ Processed {result['batchSize']} samples")
        print("✓ Results:")
        for pred in result['predictions']:
            print(f"    Sample {pred['index']}: {pred['result']} "
                  f"(confidence: {pred['confidence']:.2%})")
    except Exception as e:
        print(f"✗ Batch prediction failed: {e}")
    
    print()
    
    # Step 8: Performance analysis
    print("Step 8: Analyzing prediction performance...")
    
    try:
        import time
        
        # Single prediction timing
        start = time.time()
        for i in range(10):
            client.predict(model_id, {'data': X_test[i].tolist()})
        single_time = (time.time() - start) / 10
        
        # Batch prediction timing
        start = time.time()
        batch_inputs = [{'data': x.tolist()} for x in X_test]
        client.predict_batch(model_id, batch_inputs)
        batch_time = (time.time() - start) / len(X_test)
        
        print(f"✓ Average single prediction time: {single_time*1000:.2f}ms")
        print(f"✓ Average batch prediction time: {batch_time*1000:.2f}ms")
        print(f"✓ Speedup with batching: {single_time/batch_time:.2f}x")
    except Exception as e:
        print(f"✗ Performance analysis failed: {e}")
    
    print()
    
    # Summary
    print("="*80)
    print("Workflow Demonstration Complete!")
    print("="*80)
    print()
    print("What you've learned:")
    print("  1. How to connect to the ML Tools API")
    print("  2. How to list and select models")
    print("  3. How to retrieve model details")
    print("  4. How to run single predictions")
    print("  5. How to run batch predictions")
    print("  6. How to analyze prediction performance")
    print()
    print("Next steps:")
    print("  - Upload your own datasets")
    print("  - Train your own models")
    print("  - Track experiments")
    print("  - Build production ML pipelines")
    print()
    print("For more information, see:")
    print("  - ML-TOOLS-GUIDE.md")
    print("  - QUICKSTART.md")
    print("  - scripts/ml-utils/README.md")
    print()


def main():
    """Main entry point"""
    try:
        demonstrate_workflow()
    except KeyboardInterrupt:
        print("\n\nWorkflow demonstration interrupted by user")
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
