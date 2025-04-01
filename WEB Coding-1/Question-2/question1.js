function processNames(inputString, startingLetter) {

    const trimmedString = inputString.trim();

    const namesArray = trimmedString.split(",");

    const cleanedNames = namesArray.map(name => name.trim());

    const filteredNames = cleanedNames.filter(name => name.startsWith(startingLetter));

    const totalCharacters = cleanedNames.reduce((total, name) => total + name.length, 0);

    const joinedNames = filteredNames.join(", ");

    const containsStartingLetter = joinedNames.includes(startingLetter);

    const firstIndex = cleanedNames.findIndex(name => name.startsWith(startingLetter));

    return {
        filteredNames,
        totalCharacters,
        containsStartingLetter,
        firstIndex
    };
}

const inputString = "  Hari , Maya , Raj , Anu  ";
const startingLetter = "H";
const result = processNames(inputString, startingLetter);

console.log(result);
