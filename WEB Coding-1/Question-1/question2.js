function HUKUMUScoreCheck(marks,cutoff) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            let averageScore=marks.reduce((sum, mark)=> sum + mark, 0)/marks.length
            if(averageScore >= cutoff) {
                resolve(averageScore) 
            } else {
                reject("Sorry you haven’t cleared the HUKUMU round.")
            }
        },2000)
    })
}

HUKUMUScoreCheck([10,10,24,28,30,50],400)
.then(averageScore => {
    console.log(`${averageScore}`)
})
.catch(error => {
    console.error(error)
})