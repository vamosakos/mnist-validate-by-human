import mysql.connector
import base64
import matplotlib.pyplot as plt
from keras.datasets import mnist
from io import BytesIO
from datetime import datetime

# Connect to the MySQL database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="mnist_validate_by_human"
)
mycursor = mydb.cursor()

# Load the dataset from keras
(train_X, train_y), (test_X, test_y) = mnist.load_data()

# Save the first 60000 images to the database (train data)
for i in range(60000):
    # Select image and label
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

    # Save data to the database
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sql = "INSERT INTO mnist_images (image_id, image_label, image_base64, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)"
    val = (i, label, image_base64, now, now)  # Shift indexes after the train images
    mycursor.execute(sql, val)
    mydb.commit()

    print("Inserted train image with index:", i)

# Save the next 10000 images to the database (test data)
for i in range(10000):
    # Select image and label
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

    # Save data to the database
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sql = "INSERT INTO mnist_images (image_id, image_label, image_base64, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)"
    val = (i + 60000, label, image_base64, now, now)  # Shift indexes after the train images
    mycursor.execute(sql, val)
    mydb.commit()

    print("Inserted test image with index:", i + 60000)

mycursor.close()
mydb.close()
