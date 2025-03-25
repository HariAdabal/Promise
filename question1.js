function codingScoreCheck(marks, cutoffScore) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            let averageScore = marks.reduce((sum, mark) => sum + mark, 0)
            if(averageScore >= cutoffScore) {
                resolve(averageScore)
            } else {
                reject("Sorry you haven't cleared the coding round.")
            }
        }, 2000);
    });
}