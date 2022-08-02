function textSearch(string, queries) {
  const matches = string.split("").map((elt) => false);

  const sl = string.length;

  queries.forEach((query) => {
    const ql = query.length;
    for (let i = 0; i <= sl - ql; i++) {
      const subStr = string.substring(i, i + ql);
      if (subStr.toLowerCase() === query.toLowerCase()) {
        const end = i + ql;
        for (let j = i; j < end; j++) {
          matches[j] = true;
        }
      }
    }
  });

  const result = [];
  let matching = false;

  for (let i = 0; i <= string.length; i++) {
    if (matches[i] && !matching) {
      matching = true;
      result.push("<b>");
    }
    if (!matches[i] && matching) {
      matching = false;
      result.push("<b>");
    }
    result.push(string[i]);
  }

  console.log(result.join(""));
  return result.join("");
}

textSearch("The Quick Brown Fox Jumps Over The Lazy Dog", ["fox"]);
// 'The Quick Brown <b>Fox</b> Jumps Over The Lazy Dog'
textSearch("The quick brown fox jumps over the lazy dog", ["fox", "dog"]);
// 'The quick brown <b>fox</b> jumps over the lazy <b>dog</b>'
textSearch("This is Uncopyrightable!", ["copy", "right"]);
// 'This is Un<b>copyright</b>able!'
textSearch("This is Uncopyrightable!", ["copy", "right", "table"]);
// 'This is Un<b>copyrightable</b>!'
textSearch("aaa", ["aa"]);
// '<b>aa</b>a'
// This is because the second character cannot be used as a match again.
textSearch("aaaa", ["aa"]);
// '<b>aaaa</b>'
