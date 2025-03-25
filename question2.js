function HUKUMUScoreCheck(marks, cutoffScore) {
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            let averageScore=marks.reduce((sum, mark)=> sum + mark, 0)/marks.length
            if(averageScore >= cutoffScore) {
                resolve(averageScore) 
            } else {
                reject("Sorry you haven’t cleared the HUKUMU round.")
            }
        },2000)
    })
}