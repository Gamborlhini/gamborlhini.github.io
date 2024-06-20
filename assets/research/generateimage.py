import os
import cv2
import numpy as np
import tensorflow as tf
import argparse
from utils import utils
import matplotlib.pyplot as plt
import glob

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', type=str)
parser.add_argument('-o', '--output', type=str)
parser.add_argument('-m', '--masks', type=str)
args = parser.parse_args()

input_path = args.input
output_path = args.output
masks_path = args.masks

MaskLst = sorted(glob.glob(masks_path + "/*"))
ImageLst = sorted(glob.glob(input_path + "/*"))
colormap_custom = np.asarray([[0, 0, 0], [220, 20, 60], [255, 127, 80], [32, 178, 170]])


def decode_segmentation_masks(decode_mask, colormap, n_classes=None):
    if n_classes is None:
        n_classes = colormap.shape[0]
    r = np.zeros_like(decode_mask).astype(np.uint8)
    g = np.zeros_like(decode_mask).astype(np.uint8)
    b = np.zeros_like(decode_mask).astype(np.uint8)

    for i in range(n_classes):
        r[decode_mask == i] = colormap[i, 0]
        g[decode_mask == i] = colormap[i, 1]
        b[decode_mask == i] = colormap[i, 2]
    rgb = np.stack([r, g, b], axis=2)
    return rgb


def generate_image(image_path, mask_path, colormap):
    image, image_ori = utils.read_image_one_hot(image_path, dtype=tf.dtypes.uint16)
    image = np.array(image_ori).astype(np.uint8)
    img_mask = np.load(mask_path)
    cv2_mask = decode_segmentation_masks(img_mask, colormap)
    overlay = cv2.addWeighted(image, 0.8, cv2_mask, 0.2, 0)
    return [cv2.flip(image_ori, 0), cv2.flip(overlay, 0)]


def plot_image(display_list, output_name):
    fig, axes = plt.subplots(nrows=1, ncols=len(display_list))
    axes = axes.ravel()
    for i in range(len(display_list)):
        axes[i].imshow(tf.keras.preprocessing.image.array_to_img(display_list[i]))
        axes[i].axis('off')
    plt.savefig(output_name, dpi=fig.dpi, bbox_inches=0)
    plt.close(fig)


for idx1, mask in MaskLst:
    # validate that the decode_mask subdirectory has a matching image subdirectory
    try:
        if os.path.basename(MaskLst[idx1]) != os.path.basename(ImageLst[idx1]):
            raise IndexError("Case numbers do not match for masks and cases")
    except IndexError:
        print(IndexError)
        raise
    # select all the slices of the input image
    sliceLst = sorted(glob.glob(os.path.join(ImageLst[idx1], "*.png")))

    for idx2, filenameImg in enumerate(sliceLst):
        full_mask = np.load(os.path.join(MaskLst[idx1], "full_mask.npy"))
        plot_image(generate_image(filenameImg, mask[idx2], colormap_custom),
                   os.path.join(output_path, os.path.basename(filenameImg)))
