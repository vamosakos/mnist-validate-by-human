import random
import base64
import matplotlib.pyplot as plt
from keras.datasets import mnist
from io import BytesIO

# Betöltjük az adathalmazat
(train_X, train_y), (test_X, test_y) = mnist.load_data()

# Véletlenszerűen válasszunk ki egy indexet a betanítási adatok közül
random_index = random.randint(0, len(train_X) - 1)

# A kiválasztott kép és annak etikettje
random_image = train_X[random_index]
label = train_y[random_index]

# Megjelenítjük a képet Matplotlib segítségével
plt.imshow(random_image, cmap='gray')
plt.axis('off')

# Képet base64 kódolással konvertáljuk stringgé
buffer = BytesIO()
plt.savefig(buffer, format='png')
buffer.seek(0)
image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

# Print the ID, label, and base64-encoded image of the random MNIST image
print(random_index, label, image_base64)
