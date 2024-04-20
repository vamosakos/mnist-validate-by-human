import matplotlib.pyplot as plt
import numpy as np

# Execution times for each function
generateRandomImage_times = [0.35617995262146, 0.33957004547119, 0.33493804931641, 0.34043192863464, 0.31763982772827,
                              0.31431818008423, 0.31406998634338, 0.31776595115662, 0.31291699409485, 0.3187050819397]

FrequencyWeightedImage_times = [1.5079138278961, 1.49649310112, 1.4965670108795, 1.5119230747223, 1.491199016571,
                                1.4920239448547, 1.4952411651611, 1.4826560020447, 1.5064849853516, 1.4882249832153]

MisidentificationWeightedImage_times = [0.34757685661316, 0.33604598045349, 0.33256196975708, 0.32848215103149,
                                        0.32974195480347, 0.32238388061523, 0.32062101364136, 0.32052397727966,
                                        0.32737803459167, 0.32617402076721]

# Average execution times
average_generateRandomImage_time = np.mean(generateRandomImage_times)
average_FrequencyWeightedImage_time = np.mean(FrequencyWeightedImage_times)
average_MisidentificationWeightedImage_time = np.mean(MisidentificationWeightedImage_times)

# Plotting
plt.figure(figsize=(10, 6))

plt.plot(range(1, 11), generateRandomImage_times, marker='o', linestyle='-', color='red', label='Generate Random Image')  # Change color
plt.plot(range(1, 11), FrequencyWeightedImage_times, marker='o', linestyle='-', color='green', label='Generate Frequency Weighted Image')  # Change color
plt.plot(range(1, 11), MisidentificationWeightedImage_times, marker='o', linestyle='-', color='blue', label='Generate Misidentification Weighted Image')  # Change color

# Print average times in text bubble
plt.text(11, average_generateRandomImage_time, f'Avg Generate Random Image Time: {average_generateRandomImage_time:.4f}', va='center', ha='left', color='red', bbox=dict(facecolor='none', edgecolor='red', boxstyle='round,pad=1'))
plt.text(11, average_FrequencyWeightedImage_time + 0.02, f'Avg Generate Frequency Weighted Image Time: {average_FrequencyWeightedImage_time:.4f}', va='center', ha='left', color='green', bbox=dict(facecolor='none', edgecolor='green', boxstyle='round,pad=1'))
plt.text(11, average_MisidentificationWeightedImage_time - 0.15, f'Avg Generate Misidentification Weighted Image Time: {average_MisidentificationWeightedImage_time:.4f}', va='center', ha='left', color='blue', bbox=dict(facecolor='none', edgecolor='blue', boxstyle='round,pad=1'))

plt.title('Execution Times of Functions')
plt.xlabel('Run')
plt.ylabel('Execution Time (seconds)')
plt.xticks(range(1, 11))
plt.grid(True)
plt.legend()
plt.tight_layout()

plt.show()
