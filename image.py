import cv2
import numpy as np

images =cv2.imread('images/test.jpg')

for i in range(images.shape[0]):
    for j in range(images.shape[1]):
        images[i,j] = [255,255,255]

cv2.imshow('images', images)
cv2.waitKey(0)
cv2.destroyAllWindows()