const csvFilePath = 'openthesaurus.txt';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(csvFilePath)
});

if (checkArguments()) {
    const words = getWordsFromArguments();
    findMatches(words);
}

function checkArguments(): boolean {
    if (process.argv.length <= 2) {
        console.log('Please specify words');
        return false;
    }
    return true;
}

function getWordsFromArguments(): Array<string> {
    return process.argv.splice(2);
}

function findMatches(words: Array<string>) {
    let matches = Array<string>();
    lineReader.on('line', function (line: string) {
        words.forEach(function (word) {
            if (line.indexOf(word) !== -1) {
                const synonyms = line.split(";");
                let key = "";
                synonyms.forEach(function (synonym) {
                    if (synonym.indexOf(word) !== -1) {
                        key = synonym;
                    }
                });
                synonyms.sort(function(a, b){
                    if(a < b) { return -1; }
                    if(a > b) { return 1; }
                    return 0;
                })
                matches[key] = synonyms;
            }
        });


    }).on('close', function () {
        
        printMatches(matches);
    });
}

function printMatches(matches) {
    console.log("");
    if (Object.keys(matches).length <= 0) {
        console.log("No matches found");
        console.log("");
        return;
    }

    Object.keys(matches).forEach(function(key){
        console.log(key + ":");
        matches[key].forEach(function (word) {
            if (key !== word) {
                console.log("  " + word);
            }
        });
    });
    console.log("");
}
