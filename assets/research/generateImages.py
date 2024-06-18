import cv2
import tensorflow as tf
import numpy as np
from utils import utils


test_image, test_image_ori = utils.read_image_one_hot(None, dtype=tf.dtypes.uint16)

test_img = tf.keras.preprocessing.image.array_to_img(test_image_ori)
test_img = np.array(test_img).astype(np.uint8)
pred_mask = utils.decode_segmentation_masks(pred_label_resize, colormap)
