import argparse
import csv
import os

import numpy as np
import glob
from utils import utils

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', type=str)
parser.add_argument('-r', '--resolution', type=str)
parser.add_argument('-o', '--output', type=str)
args = parser.parse_args()

input_path = args.input
output_path = args.output
resolution = args.resolution
resolution_list = []

try:
    if not os.path.exists(output_path):
        raise FileNotFoundError("Output folder does not exist")
    if not os.path.exists(input_path):
        raise FileNotFoundError("Input folder does not exist")
except FileNotFoundError:
    print(FileNotFoundError)
    raise

case_list = sorted(glob.glob(input_path + "/*"))
output_file = os.path.join(output_path, "output.csv")

with open(resolution, "r", newline='') as csvfile:
    resolution_list = list(csv.reader(csvfile, delimiter=','))


with open(output_file, "w") as f:
    writer = csv.writer(f)
    writer.writerow(["Case",
                     "Full (voxel)",
                     "Full (mm3)",
                     "Infraspinatus (mm3)",
                     "Supraspinatus (mm3)",
                     "Subscapularis (mm3)"
                     ])

for idx1, case in case_list:

    case_resolution = resolution_list[resolution_list[:, 0].index(case)][1]
    scaling_factor = int(case_resolution)**3

    row = [str(case)]

    with file(os.path.join(case, "full_mask.npy"), "r") as file:
        full_mask = np.load(file)
        full_volume = utils.pred_volume(full_mask)
        row.append(full_volume)
        row.append(full_volume*scaling_factor)

    with file(os.path.join(case, "infraspinatus_mask.npy"), "r") as file:
        infraspinatus_mask = np.load(file)
        infraspinatus_volume = utils.pred_volume(infraspinatus_mask)
        row.append(infraspinatus_volume*scaling_factor)

    with file(os.path.join(case, "supraspinatus_mask.npy"), "r") as file:
        supraspinatus_mask = np.load(file)
        supraspinatus_volume = utils.pred_volume(supraspinatus_mask)
        row.append(supraspinatus_volume*scaling_factor)

    with file(os.path.join(case, "subscapularis_mask.npy"), "r") as file:
        subscapularis_mask = np.load(file)
        subscapularis_volume = utils.pred_volume(subscapularis_mask)
        row.append(subscapularis_volume*scaling_factor)

    with open(output_file, "a") as f:
        writer = csv.writer(f, delimiter=',')
        writer.writerow(row)
