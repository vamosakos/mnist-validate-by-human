import numpy as np
import matplotlib.pyplot as plt
import ast
import sys
import base64
import io

def generate_heatmap(label_counts):
    label_counts = ast.literal_eval(label_counts)

    matrix = np.zeros((10, 10))

    for label, counts in label_counts.items():
        for guest_response, count in enumerate(counts):
            matrix[int(label)][guest_response] = count

    plt.figure(figsize=(8, 6), tight_layout=True) 
    plt.imshow(matrix, cmap='binary_r', interpolation='nearest') 
    plt.colorbar(label='Count')
    plt.xlabel('Predicted Number Label')
    plt.ylabel('Correct Number Label')

    plt.xticks(np.arange(10), np.arange(10))
    plt.yticks(np.arange(10), np.arange(10))

    for i in range(10):
        for j in range(10):
            count = matrix[i, j]
            if count < np.max(matrix) / 2:
                text_color = 'white'
            else:
                text_color = 'black'
            plt.text(j, i, str(int(count)), ha='center', va='center', color=text_color)
            plt.gca().add_patch(plt.Rectangle((j - 0.5, i - 0.5), 1, 1, fill=False, edgecolor='white', linewidth=0.5))

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    heatmap_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()

    return heatmap_base64

if __name__ == "__main__":
    json_data = sys.argv[1]

    heatmap_base64 = generate_heatmap(json_data)

    print(heatmap_base64)
