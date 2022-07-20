function uniqueArray(array) {
  const isUnique = {};

  array.forEach((elt) =>
    elt in isUnique ? (isUnique[elt] = false) : (isUnique[elt] = true)
  );

  return array.filter((elt) => !isUnique[elt]);
}

console.log(uniqueArray([1]));
console.log(uniqueArray([1, 1, 2]));
console.log(uniqueArray([2, 1, 2]));
