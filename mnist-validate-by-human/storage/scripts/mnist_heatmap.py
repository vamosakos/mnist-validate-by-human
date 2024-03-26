import numpy as np
import matplotlib.pyplot as plt
import ast
import sys
import base64
import io

def generate_heatmap(label_counts):
    # Safely evaluate the JSON-like string using ast.literal_eval()
    label_counts = ast.literal_eval(label_counts)

    # Initialize a 10x10 matrix to store true/false predictions
    matrix = np.zeros((10, 10))

    # Populate the matrix with true/false predictions
    for label, counts in label_counts.items():
        for guest_response, count in enumerate(counts):
            matrix[int(label)][guest_response] = count

    # Plot the heatmap
    plt.figure(figsize=(8, 6), tight_layout=True)  # Adjusted line with tight_layout
    plt.imshow(matrix, cmap='binary_r', interpolation='nearest')  # Invert the colormap
    plt.colorbar(label='Count')
    plt.xlabel('Predicted Number Label')
    plt.ylabel('Correct Number Label')

    # Set the x and y ticks to show all numbers from 0 to 9
    plt.xticks(np.arange(10), np.arange(10))
    plt.yticks(np.arange(10), np.arange(10))

    # Annotate each square with the count of the predicted number and add a thin border
    for i in range(10):
        for j in range(10):
            count = matrix[i, j]
            # Adjust text color based on the intensity of the heatmap
            if count < np.max(matrix) / 2:
                text_color = 'white'
            else:
                text_color = 'black'
            # Annotate square with count and add border
            plt.text(j, i, str(int(count)), ha='center', va='center', color=text_color)
            plt.gca().add_patch(plt.Rectangle((j - 0.5, i - 0.5), 1, 1, fill=False, edgecolor='white', linewidth=0.5))

    # Convert the heatmap image to base64 string
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    heatmap_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()

    return heatmap_base64

if __name__ == "__main__":
    # Read JSON data passed from Laravel backend
    json_data = sys.argv[1]

    # Generate heatmap and get base64 string
    heatmap_base64 = generate_heatmap(json_data)

    # Print the base64 string (you can send it to your backend)
    print(heatmap_base64)
