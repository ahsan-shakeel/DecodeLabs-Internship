# Iris Flower Classification using K-Nearest Neighbors (KNN)

An end-to-end machine learning pipeline implemented in Python to classify Iris flower species (`setosa`, `versicolor`, and `virginica`) using the **K-Nearest Neighbors (KNN)** algorithm. The project covers data preprocessing, exploratory data analysis with outlier detection, feature standardization, model training, and performance evaluation.

---

## Workflow & Features

* **Data Inspection:** Verified zero missing values across all sepal and petal dimension features.
* **Outlier Detection & Removal:** Analyzed distribution boxplots and applied the Interquartile Range ($IQR$) filtering method on `sepal_width_cm`, cleaning 4 statistical outliers.
* **Stratified Train-Test Split:** Split the dataset with an 80/20 train-test ratio using `stratify=y` and `random_state=43` to ensure uniform class distributions across subsets.
* **Feature Scaling:** Standardized features via `StandardScaler` ($\mu = 0, \sigma = 1$) fitted on training data and applied to testing sets to prevent data leakage.
* **KNN Model Training:** Trained a `KNeighborsClassifier` with $k = 15$ nearest neighbors.
* **Evaluation & Diagnostics:** Generated confusion matrices and classification reports visualizing precision, recall, and F1-score across all 3 flower species.

---

## Model Evaluation & Performance

The model achieved an **overall accuracy of 90.00%** on the unseen test dataset.

### Classification Report

| Species | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: |
| **Setosa** | 1.00 | 1.00 | 1.00 | 10 |
| **Versicolor** | 0.82 | 0.90 | 0.86 | 10 |
| **Virginica** | 0.89 | 0.80 | 0.84 | 10 |
| **Overall Accuracy** | — | — | **0.90** | **30** |

### Confusion Matrix Breakdown

| Actual \ Predicted | Setosa | Versicolor | Virginica |
| :--- | :---: | :---: | :---: |
| **Setosa** | 10 | 0 | 0 |
| **Versicolor** | 0 | 9 | 1 |
| **Virginica** | 0 | 2 | 8 |

---

## Project Structure

```text
iris-knn-classification/
│
├── iris_classification.ipynb   # Jupyter Notebook with EDA, scaling, and KNN model
├── iris_dataset.csv            # Iris dataset containing feature dimensions and species
└── README.md                   # Project documentation and performance metrics
```

---

## Getting Started

### Prerequisites

* Python 3.8+
* Jupyter Notebook / JupyterLab

Install dependencies:
```bash
pip install pandas numpy scikit-learn matplotlib seaborn
```

### Running the Notebook

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/iris-knn-classification.git
   cd iris-knn-classification
   ```
2. Launch Jupyter Notebook:
   ```bash
   jupyter notebook iris_classification.ipynb
   ```
3. Run all cells sequentially to reproduce the data cleaning, visualizations, and model metrics.

---

