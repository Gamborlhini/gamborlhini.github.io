import os
import csv
import argparse
import glob
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', type=str)
parser.add_argument('-o', '--output', type=str)
parser.add_argument('-c', '--crop', type=str)
args = parser.parse_args()

input_path = args.input
output_path = args.output
crop_path = args.crop

case_list = sorted(glob.glob(input_path + '/**/'))

crop_list = list(csv.reader(open(crop_path)))
crop_list = np.array(crop_list)

for idx1, case in enumerate(case_list):
    crop = int(crop_list[crop_list[:, 0] == case][1])
    mask = np.load(case + '/full_mask.npy')[crop:, ...]
    np.save(str(os.path.join(output_path, case, 'full_mask.npy')), mask)