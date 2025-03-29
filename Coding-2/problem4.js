const comments = [
    "Buy now and get 50% OFF!",
    "This is a great product",
    "Limited-time OFFER, visit now!",
    "Nice blog post!",
    "Get cheap deals now!"
  ];
  
  const spamWords = ["buy", "offer", "cheap"];
    let lowerCaseWords = spamWords.map(word => word.toLowerCase());

    let filteredComments = comments.filter(comment => {
      let lowerCaseComment = comment.toLowerCase();
      return !lowerCaseWords.some(spamWord => lowerCaseComment.includes(spamWord));
    });
    console.log(filteredComments);