import json
import os

#
# // PULL_LABELS = toJson(github.event.pull_request.labels)
# 
# [
# 	{
# 		"color": "FFFFF7",
# 		"default": false,
# 		"description": "Issue describes change in the development process",
# 		"id": 1786730933,
# 		"name": "label_pqr-xyz-release",
# 		"node_id": "MDU6TGFiZWwxNzg2NzMwOTMz",
# 		"url": "https://api.github.com/repos/parzh/parzh.github.io/labels/Domain:%20dev"
# 	},
# 	{
# 		"color": "cc062a",
# 		"default": false,
# 		"description": "Issue must be addressed right now",
# 		"id": 1786706637,
# 		"name": "label_abc-release",
# 		"node_id": "MDU6TGFiZWwxNzg2NzA2NjM3",
# 		"url": "https://api.github.com/repos/parzh/parzh.github.io/labels/Priority:%20top"
# 	},
# 	{
# 		"color": "00727C",
# 		"default": false,
# 		"description": "Issue describes lack of a functionality or an open possibility of enhancement",
# 		"id": 1786726751,
# 		"name": "label_123-improvement",
# 		"node_id": "MDU6TGFiZWwxNzg2NzI2NzUx",
# 		"url": "https://api.github.com/repos/parzh/parzh.github.io/labels/Type:%20improvement"
# 	}
# ]
#
# Test:
# PULL_LABELS=$(cat labels.json) python3 generate_release_matrix.py
#

try:
    labels = json.loads(os.getenv('PULL_LABELS'))
except:
    labels = []

trigger_substring = "-release"
matrix = []
hasLabels = False
for label in labels:
    label_name = str(label['name'])
    trigger_substring_index = label_name.find(trigger_substring)
    if trigger_substring_index != -1:
        matrix.append({
            'package': label_name[:trigger_substring_index],
        })
        hasLabels = True

print(json.dumps({'include': matrix}))