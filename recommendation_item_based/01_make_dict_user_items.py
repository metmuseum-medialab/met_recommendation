# Loading the python csv module
import csv
import json

# Loading the original file and reading its headers
original_data = open('../data/saved_item.csv','rb')
reader = csv.reader(original_data, delimiter = ',')
headers = reader.next()
# print headers

# From this file we only need the CrdId (item)
# and the User_Id (person)
# Let's find out in which column they are
item_column = 0
user_column = 0
for i in range(len(headers)):
	if headers[i] == "CrdId":
		item_column = i
	elif headers[i] == "User_Id":
		user_column = i
# print item_column
# print user_column

# Not let's create a dictionary of { user: { item: 1.0, ...}, ... }
user_dict = {}

# Make a dictionary with user preferences
for row in reader:
	
	# Grabbing user and item IDs
	user_id = row[user_column]
	item_id = row[item_column]

	# Checking if the user is already on the dictionary
	if user_id not in user_dict:
		# If not, create a new one with an empty collection of items
		user_dict.setdefault(user_id, {})

	# Fill in the user collection with the new item
	if item_id not in user_dict[user_id] and item_id != "NULL":
		user_dict[user_id].setdefault(item_id, 1)

print("Found " + str(len(user_dict)) + " users.")

# Saving everything to a json file
jsonFile = open("../data/user_preferences.json", "w")
jsonFile.write(json.dumps(user_dict, indent=4, sort_keys=True))
jsonFile.close()

print('Successfully saved data to ../data/user_preferences.json')