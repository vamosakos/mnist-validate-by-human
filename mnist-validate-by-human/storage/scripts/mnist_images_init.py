import mysql.connector
import base64
import matplotlib.pyplot as plt
from keras.datasets import mnist
from io import BytesIO
from datetime import datetime

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="mnist_validate_by_human"
)
mycursor = mydb.cursor()

(train_X, train_y), (test_X, test_y) = mnist.load_data()

fig, ax = plt.subplots(figsize=(2.8, 2.8), dpi=130) 

for i in range(60000):
    image = train_X[i]
    label = int(train_y[i])

    ax.clear()

    plt.imshow(image, cmap='gray')
    plt.axis('off')

    buffer = BytesIO()
    plt.savefig(buffer, format='png', transparent=True, bbox_inches='tight', pad_inches=0)
    buffer.seek(0)

    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sql = "INSERT INTO mnist_images (image_id, image_label, image_base64, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)"
    val = (i, label, image_base64, now, now)
    mycursor.execute(sql, val)
    mydb.commit()

    print("Inserted train image with index:", i)

for i in range(10000):
    image = test_X[i]
    label = int(test_y[i])

    ax.clear()

    plt.imshow(image, cmap='gray')
    plt.axis('off')

    buffer = BytesIO()
    plt.savefig(buffer, format='png', transparent=True, bbox_inches='tight', pad_inches=0)
    buffer.seek(0)

    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sql = "INSERT INTO mnist_images (image_id, image_label, image_base64, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)"
    val = (i + 60000, label, image_base64, now, now)
    mycursor.execute(sql, val)
    mydb.commit()

    print("Inserted test image with index:", i + 60000)

mycursor.close()
mydb.close()