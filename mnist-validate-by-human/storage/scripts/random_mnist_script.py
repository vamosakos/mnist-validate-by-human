import random
import base64
import matplotlib.pyplot as plt
from keras.datasets import mnist
from io import BytesIO

# Betöltjük az adathalmazat
(train_X, train_y), (test_X, test_y) = mnist.load_data()

# Véletlenszerűen válasszunk ki egy indexet
random_index = random.randint(0, len(train_X) - 1)

# Ha a random index a test adathalmaz tartományán belül van
if random_index < len(test_X):
    if random.choice([1, 0]):  # Véletlenszerűen választunk, hogy a train vagy test adathalmazból vegyük a képet
        dataset_type = "test"
        random_image = test_X[random_index]
        label = test_y[random_index]
    else:
        dataset_type = "train"
        random_image = train_X[random_index]
        label = train_y[random_index]
else:
    dataset_type = "train"
    random_image = train_X[random_index]
    label = train_y[random_index]

# Create a plot with a white background
plt.imshow(random_image, cmap='gray')
plt.gca().set_facecolor('none')  # Set background color to transparent
plt.axis('off')

# Save the plot to a buffer as PNG
buffer = BytesIO()
plt.savefig(buffer, format='png', transparent=True)  # Set transparent=True
buffer.seek(0)

# Convert the image to base64
image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

# Print the ID, label, dataset type, and base64-encoded image of the random MNIST image
print(random_index, label, dataset_type, image_base64)
