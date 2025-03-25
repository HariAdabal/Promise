function unitMovementCheck(averageCodingScore, averageHukumuScore, cutOffScore) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            let averageScore = (averageCodingScore + averageHukumuScore)/2;

            if(averageScore >= cutOffScore) {
                resolve(averageScore)
            } else {
                reject("Sorry you haven't cleared the final cutoff.")
            }
        },2000)
    })
}