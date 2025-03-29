const orders = ['$120', ' 75 ', '₹200', '$50', ' 300', '150']
let sum=0

for(let order of orders) {
    let ans = ''
    for(let char of order) {
        if(char >= '0' && char <= '9') {
            ans += char
        }
    }
    ans = +ans;

    if(ans >= 100) {
        sum += ans
    }
}
console.log(sum)