/*
 Implement a Bloom filter based spell checker.
 */

// -------------------------- BLOOM FILTER INITIALIZING LOGIC ---------------------------
// BloomFilter class
class BloomFilter {
  constructor(size, numOfHashes) {
    this.bitArray = new Array(size).fill(0) //initializing bitset array
    this.numOfHashes = numOfHashes
  }

  // hash function
  hash(key) {
    const hashNumbers = [];
    for (let i = 1; i <= this.numOfHashes; i++) {
      hashNumbers.push(
        Math.abs(
          key.split("").reduce((a, b) => ((a << i) - a + b.charCodeAt(0)) | 0, 0)
        )
      );
    }
    return hashNumbers;
  };

  insert(newWord) {
    let indexes = this.hash(newWord)
    indexes.forEach((index) => this.bitArray[index] = 1)
  }

  query(word) {
    let hashes = this.hash(word) // hash the input word first
    console.log('hashes ', hashes)
    let result = hashes.filter(index => !this.bitArray[index]) // then check the hashes value in bit array and
    console.log('result ', result)
    return result.length <= 0
  }
}

// Initializing Bloom Filter by creating bitset array that is 8 times as many values in words in wordlist.txt
// using 6 hash functions
const multiplier = 8
const numOfHashes = 6
const bloom_filter = new BloomFilter(338882*multiplier, numOfHashes)

// Reading the wordlist.txt file and inserting each word from the dictionary into the Bloom Filter
fetch("./wordlist.txt")
  .then(response => response.text())
  .then(text => {
    var lines = text.split('\n'); // read file line by line
    for(let line = 0; line < lines.length; line++){
      bloom_filter.insert(lines[line])
    }
  })


// ---------------------------- GAME INTERACTION LOGIC ------------------------------------------

const correctWords = []
const wrongWords = []
// Heart icon shows up for correct spelling
function toggleCorrectIcon(val) {
  const correctIcon = document.getElementById("correct")
  correctIcon.style.visibility = val
}

// Cross icon shows up for wrong spelling
function toggleWrongIcon(val) {
  const wrongIcon = document.getElementById("wrong")
  wrongIcon.style.visibility = val
}

// Progress bars width
let correctBarWidth = 0
let wrongBarWidth = 0

// Correct answer progress bar handling
function incrementCorrect() {
  const correctBar = document.getElementById("current-correct")
  const correctBarWidth = correctBar.clientWidth + 50
  if (correctBarWidth <= 500) {
    correctBar.style.width = `${correctBarWidth}px`
  }
  if (correctBarWidth === 500) {
    document.getElementById("won-dialog").showModal()
  }
}

// Incorrect answer progress bar handling
function incrementWrong() {
  const wrongBar = document.getElementById("current-wrong")
  const wrongBarWidth = wrongBar.clientWidth + 50

  if (wrongBarWidth <= 500) {
    wrongBar.style.width = `${wrongBarWidth}px`
  }
  if (wrongBarWidth === 500) {
    document.getElementById("lost-dialog").showModal();
  }
}

// Clearing input value
function clearInput() {
  const input = document.getElementById("input_word")
  input.value = ""
}

// Clearing typed words on reset
function clearTypedWords() {
  const correctLists = document.querySelectorAll("#correct-typed-words li")
  for(let i=0; i < correctLists.length; i++) {
    const li = correctLists[i]
    if (li) {
      li.parentNode.removeChild(li);
    }
  }
  const wrongTypedWords = document.querySelectorAll("#wrong-typed-words li")
  for(let i=0; i < wrongTypedWords.length; i++) {
    const li = wrongTypedWords[i]
    if (li) {
      li.parentNode.removeChild(li);
    }
  }
}

// Reseting the game
function reset() {
  document.getElementById("won-dialog").close()
  document.getElementById("lost-dialog").close()
  correctBarWidth = 0
  wrongBarWidth = 0
  const correctBar = document.getElementById("current-correct")
  correctBar.style.width = correctBarWidth
  const wrongBar = document.getElementById("current-wrong")
  wrongBar.style.width = wrongBarWidth
  toggleCorrectIcon("hidden")
  toggleWrongIcon("hidden")
  clearInput()
  clearTypedWords()
}

const correctTypedWords = document.getElementById("correct-typed-words")
const wrongTypedWords = document.getElementById("wrong-typed-words")
// This function will be invoked when clicking on CHECK IT button
// It checks the word in the bloom filter then calls corresponding result icon and status bar
function spellCheck() {
  toggleCorrectIcon("hidden")
  toggleWrongIcon("hidden")
  const input = document.getElementById("input_word")
  const value = input.value
  if (value) {
    const res = bloom_filter.query(value) // checking input value in bloom filter
    if (res) { // the word is in the bloom filter, and it is MOST LIKELY spelled correctly
      toggleCorrectIcon("visible")
      incrementCorrect()
      const newLi = document.createElement("li")
      newLi.appendChild(document.createTextNode(value))
      correctTypedWords.appendChild(newLi)
    } else { // the word is not in the bloom filter, and it is DEFINITELY spelled incorrectly
      toggleWrongIcon("visible")
      incrementWrong()
      const newLi = document.createElement("li")
      newLi.appendChild(document.createTextNode(value))
      wrongTypedWords.appendChild(newLi)
    }
  }
  clearInput()
}
