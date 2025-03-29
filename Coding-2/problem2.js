const userNames = [' Alice ', 'bob', ' Charlie', 'alice', 'BOB ']
let finalAns = [ ... new Set(userNames.map(username => username.trim().toLowerCase()))].sort()
console.log(finalAns)