function unitMovementCheck(averageCodingScore, averageHukumuScore, cutoff) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let averageScore = (averageCodingScore + averageHukumuScore)/2;

            if(averageScore >= cutoff) {
                resolve(averageScore)
            } else {
                reject("Sorry you haven't cleared the final cutoff.")
            }
        },2000)
    })
}

unitMovementCheck(45.66,53.90,75)
.then(averageScore => {
    console.log(`${averageScore}`)
})
.catch(error => {
    console.error(error)
})