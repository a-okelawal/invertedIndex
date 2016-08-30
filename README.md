# inverted-index
This is a javascript library that runs on node, which takes in an array of json objects from a file path and converts the strings in the json objects into a word [inverted index](https://en.wikipedia.org/wiki/Inverted_index).

## Requirements
The following are required: a node environment and jasmine for testing.

Clone or Download and Unzip into a folder. Open command prompt in that folder and do the following:
- Download and install node from [here](https://nodejs.org/en/download/).
- In command prompt enter " *node -v* " to check the version of node and ensure it was installed properly.
- Once confirmed, enter " *npm install -g jasmine* ".
- Enter "*jasmine init*"

## How To Use
The File inverted-index contains a number of Functions under a class called "**WordIndexFactory**".  It contains the following functions:
- **createIndex(filePath)**: This takes a file path that contains the file with the array of json objects. It reads the array and converts it into the inverted word index.
- **getJsonForm(file)**: This takes the file name, along with the extension e.g. movies.json, and returns the json form of the file.
- **getIndex(file)**: This takes the file name, along with the extension e.g. movies.json, and returns the inverted word index of the file.
- **searchIndex(file, fullQuery, callback)**: This takes in 3 arguments *file name*, *the query being searched for* and *a callback function when used i.e. function(err, data){..}*. The function searches the inverted word index array, with the file name, against the query and returns an array of indices where it was found.
- **flattenArray(value)** - This is a function used to flatten multiple level arrays into a 1 level array.
