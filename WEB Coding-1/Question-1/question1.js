function codingScoreCheck(marks,cutoff) {
    return new Promise((resolve,reject) => {
        setTimeout(()=>{
            let averageScore = marks.reduce((sum,marks) => sum + marks, 0)
            if(averageScore >= cutoff) {
                resolve(averageScore)
            } else {
                reject("Sorry you haven't cleared the coding round")
            }
        },2000)
    })
}

codingScoreCheck([12, 13, 25, 50, 100], 58)
    .then(averageScore => {
        console.log(`${averageScore}`);
    })
    .catch(error => {
        console.error(error);
    });

