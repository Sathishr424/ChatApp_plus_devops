import argparse
import os
from pathlib import Path

parser = argparse.ArgumentParser()

parser.add_argument("name")

args = parser.parse_args()

parent = "./shared"
feature = ["controller", "service", "repository"]
features = ["controllers", "services", "repositories"]
created = []

for i, f in enumerate(features):
    folder = os.path.join(parent, f)
    os.makedirs(folder, exist_ok=True)

    file_path = os.path.join(folder, str(args.name) + str(feature[i].capitalize()) + ".ts")
    Path(file_path).touch()

    created.append(file_path)

print(created)
