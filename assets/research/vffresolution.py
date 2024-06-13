import csv
import re
import argparse
import glob
import os


def get_resolution(vff_folder, output_folder):
    lst_files = sorted(glob.glob(os.path.join(vff_folder, '*.vff')))
    csv_lst = []
    for idx1, file in lst_files:
        with open(file, 'rb') as f:
            for line in f:
                if bytes.isspace(line):
                    break

                line_str = line.rstrip().decode()

                if line_str.startswith('spacing='):
                    spacing_lst = re.findall(r'\d+.\d+', line_str)
            csv_lst.append([os.path.basename(file).split(".")[0], spacing_lst[0], spacing_lst[1], spacing_lst[2]])
        with open(os.path.join(output_folder, "resolution.csv"), 'w') as f:
            csv_writer = csv.writer(f)
            csv_writer.writerows(csv_lst)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', type=str, help='input folder', required=True)
    parser.add_argument('-o', '--output', type=str, help='output folder', required=True)
    args = parser.parse_args()
    get_resolution(args.input, args.output)
    print('Resolution file written.')
