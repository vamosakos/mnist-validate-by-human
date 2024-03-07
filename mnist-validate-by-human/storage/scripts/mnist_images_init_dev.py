import mysql.connector
import base64
import matplotlib.pyplot as plt
from keras.datasets import mnist
from io import BytesIO

# Kapcsolódás a MySQL adatbázishoz
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="mnist_validate_by_human"
)
mycursor = mydb.cursor()

# Betöltjük az adathalmazat a kerasból
(train_X, train_y), (test_X, test_y) = mnist.load_data()

# Az első 100 kép mentése az adatbázisba (train adatok)
for i in range(100):
    # Kép és címke kiválasztása
    image = train_X[i]
    label = int(train_y[i])

    # Create a plot with a white background
    plt.imshow(image, cmap='gray')
    plt.gca().set_facecolor('none')  # Set background color to transparent
    plt.axis('off')

    # Save the plot to a buffer as PNG
    buffer = BytesIO()
    plt.savefig(buffer, format='png', transparent=True)  # Set transparent=True
    buffer.seek(0)

    # Convert the image to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    # Adatok mentése az adatbázisba
    sql = "INSERT INTO mnist_images (image_id, image_label, image_base64) VALUES (%s, %s, %s)"
    val = (i, label, image_base64)
    mycursor.execute(sql, val)
    mydb.commit()

    print("Inserted train image with index:", i)

# Az első 100 kép mentése az adatbázisba (test adatok)
for i in range(100):
    # Kép és címke kiválasztása
    image = test_X[i]
    label = int(test_y[i])

    # Create a plot with a white background
    plt.imshow(image, cmap='gray')
    plt.gca().set_facecolor('none')  # Set background color to transparent
    plt.axis('off')

    # Save the plot to a buffer as PNG
    buffer = BytesIO()
    plt.savefig(buffer, format='png', transparent=True)  # Set transparent=True
    buffer.seek(0)

    # Convert the image to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    # Adatok mentése az adatbázisba
    sql = "INSERT INTO mnist_images (image_id, image_label, image_base64) VALUES (%s, %s, %s)"
    val = (i + 60000, label, image_base64)  # Az indexek eltolása a train képek után
    mycursor.execute(sql, val)
    mydb.commit()

    print("Inserted test image with index:", i + 60000)

mycursor.close()
mydb.close()
