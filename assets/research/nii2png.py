import nibabel as nib
import argparse
import glob
import os
import cv2
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', type=str)
parser.add_argument('-o', '--output', type=str)
args = parser.parse_args()

nii_folder = args.input
output_folder = args.output

try:
    if not os.path.exists(nii_folder):
        raise FileNotFoundError("input folder not found")
    if not os.path.exists(output_folder):
        raise FileNotFoundError("output folder not found")
except FileNotFoundError:
    print(FileNotFoundError)
    raise

NiiCaseLst = sorted(glob.glob(os.path.join(nii_folder, "*.nii.gz")))
print(NiiCaseLst)

for case in NiiCaseLst:
    img_data = nib.load(case)
    img_data = img_data.get_fdata()
    img_data_unsigned = img_data - np.min(img_data)

    img_data_uint16 = img_data_unsigned.astype(np.uint16)

    out_folder_prefix = os.path.basename(case).split('_')[0]
    case_output_folder = os.path.join(output_folder, out_folder_prefix)

    print(case_output_folder)

    for i in range(img_data_uint16.shape[0]):
        if not os.path.exists(case_output_folder):
            os.mkdir(case_output_folder)
        out_path = str(os.path.join(case_output_folder, "slice" + str(i+1).zfill(3) + ".png"))

        img_uint16_slice = img_data_uint16[i, ...]
        img = np.repeat(img_uint16_slice[..., np.newaxis], 3, axis=-1)
        # print(img.shape, img.dtype)
        cv2.imwrite(out_path, img)