"""
Created on 12/06/2024
@author: Nikhil Subhas

script to threshold .png image stacks from CT scans and apply a mask

args.input expects an input directory with subdirectories containing .png image stacks

args.masks expects an input directory with matching subdirectory names to input each containing 4
.npy masks which are outputted from the predict file

(e.g. inside the "args.input" directory the directories T001, T002, ..., T00n must have matching directories
T001, T002, ..., T00n within the "args.masks" directory)

args.output expects an output directory
"""

import os
import glob
import numpy as np
import argparse
import tensorflow as tf
from utils import utils

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', type=str)
parser.add_argument('-m', '--masks', type=str)
parser.add_argument('-o', '--output', type=str)
args = parser.parse_args()

masks_folder = args.masks
input_folder = args.input
output_folder = args.output

# set threshold here
upperThreshold = -29

# converts threshold to uint16 given the -1024/1500 windowing for HU
upperThreshold = upperThreshold + 1024
upperThreshold = np.uint16(upperThreshold)

# check that input and output folders exist
try:
    if not os.path.exists(output_folder):
        raise FileNotFoundError("Output folder does not exist")
    if not os.path.exists(input_folder):
        raise FileNotFoundError("Input folder does not exist")
except FileNotFoundError:
    print(FileNotFoundError)
    raise

# select all the subdirectories of input and masks folders
MaskLst = sorted(glob.glob(masks_folder + "/*"))
ImageLst = sorted(glob.glob(input_folder + "/*"))

# iterate through each mask subdirectory
for idx1, mask in MaskLst:

    # validate that the mask subdirectory has a matching image subdirectory
    try:
        if os.path.basename(MaskLst[idx1]) != os.path.basename(ImageLst[idx1]):
            raise IndexError("Case numbers do not match for masks and cases")
    except IndexError:
        print(IndexError)
        raise

    # select all the slices of the input image
    sliceLst = sorted(glob.glob(os.path.join(input_folder, ImageLst[idx1], "*.png")))

    # each mask should be in the shape n x m x slices
    full_mask = np.load(os.path.join(masks_folder, MaskLst[idx1], "full_mask.npy"))
    infraspinatus_mask = np.load(os.path.join(masks_folder, MaskLst[idx1], "infraspinatus_mask.npy"))
    supraspinatus_mask = np.load(os.path.join(masks_folder, MaskLst[idx1], 'supraspinatus_mask.npy'))
    subscapularis_mask = np.load(os.path.join(masks_folder, MaskLst[idx1], 'subscapularis_mask.npy'))

    # initialize empty fat masks
    full_mask_fat, infraspinatus_mask_fat, supraspinatus_mask_fat, subscapularis_mask_fat = [], [], [], []

    for idx2, filenameImg in sliceLst:
        # img should be n x m x 3 which we cut down to n x m since the three channels
        # should be identical
        img, img_ori = utils.read_image_one_hot(filenameImg, dtype=tf.dtypes.uint16)

        # ensure the slice of image and slice of mask have the same size
        try:
            if full_mask[..., idx2].shape != img_ori.shape:
                raise TypeError("Mask and slice are not the same size")
        except TypeError:
            print(TypeError)
            raise

        # create a boolean array of when the image value is smaller than the upper threshold
        fat = (img < upperThreshold)

        full_mask_fat = full_mask[fat, idx2]
        # combine that array with the segmentation masks using a logical and function
        infraspinatus_mask_fat[:, :, idx2] = np.logical_and(fat, infraspinatus_mask.astype(bool))
        supraspinatus_mask_fat[:, :, idx2] = np.logical_and(fat, supraspinatus_mask.astype(bool))
        subscapularis_mask_fat[:, :, idx2] = np.logical_and(fat, subscapularis_mask.astype(bool))

    # save all the fat masks to the output folder within subdirectories
    if args.output:
        np.save(os.path.join(str(output_folder), os.path.basename(MaskLst[idx1]), "full_mask_fat.npy"),
                full_mask_fat)
        np.save(os.path.join(str(output_folder), os.path.basename(MaskLst[idx1]), "infraspinatus_mask_fat.npy"),
                infraspinatus_mask_fat)
        np.save(os.path.join(str(output_folder), os.path.basename(MaskLst[idx1]), "supraspinatus_mask_fat.npy"),
                supraspinatus_mask_fat)
        np.save(os.path.join(str(output_folder), os.path.basename(MaskLst[idx1]), "subscapularis_mask_fat.npy"),
                subscapularis_mask_fat)
