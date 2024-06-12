import numpy as np
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', type=str)
args = parser.parse_args()

file = args.input

mask = np.load(file)
print(mask.shape)
