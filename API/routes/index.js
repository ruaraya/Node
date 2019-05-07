const fs = require('fs');
var express = require('express');
var router = express.Router();
const wordListPath = require('word-list');

const wordList = fs.readFileSync(wordListPath, 'utf8').split('\n');
router.use(express.json());

/** Applies validation in the input parameters
*/
function validateInput(word){

  var error = "";

  if (!word || word.length < 2 ){
    error = "word should be minimun 2 characters long";
    return error
  } else if (hasNumbers(word) == true){
    error = "only characters allowed";
    return error
  } else {
    return "OK"
  }

}

/** Indicates if the input has numbers
*/
function hasNumbers(word) {
  return /\d/.test(word);
}

/** Validates if two words share the same characters
*/
function hasPattern(word1, word2) {

  match1 = true
	match2 = true
	final = true

  for (var i = 0; i<word1.length; i++){
    var char = word1.charAt(i);
    match1 = word2.includes(char);
        
    if (match1 == false){
      return false;
    }
  } 

  for (var i = 0; i<word2.length; i++){
    var char = word2.charAt(i);
    match2 = word1.includes(char);
        
    if (match2 == false){
      return false;
    }
  }

  if (match1 == true && match2 == true) {
		final = true
  }
  
  return final;   
}

/**
 * @api {get} /find Find Anagrams
 * @apiDescription This endpoint will find all anagrams in the english dictionary based on the string sent
 * @apiParam (query) {String} word
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" http://localhost:3001/find?word=test
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *      "word1",
 *      "word2",
 *      "word3"
 *   ]
 */
router.get('/find', (req, res) => {
  
  var word = "";
  var error = "";
  var match1 = false;
  var match2 = false;
  var anagrams = [];
  
  if (!req.query.word){
    res.status(400).send(false);
    return
  }

  word1 = req.query.word.toLowerCase();
  error = validateInput(word1)

  if (error != "OK"){
    res.status(400).send(error);
    return
  }

  for (var i = 0; i<wordList.length; i++){
    word = wordList[i];

    if (word1.length == word.length){

      if(word1 == word){
        match1 = true;
        continue;
      }

      if (hasPattern(word1, word) == true) {
        anagrams.push(word);
        match2 = true;
      }
      
    }

  }

  if (match1 == false || match2 == false){
    res.status(200).send(false);
  } else {
    res.status(200).send(anagrams);
  }

});

/**
 * @api {get} /compare Compare Anagrams
 * @apiDescription This endpoint will receive two words, and compare them to see if they are anagrams
 * @apiGroup Anagram
 * @apiParam (query) {String} word1
 * @apiParam (query) {String} word2
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" http://localhost:3001/compare?word1=test&word2=tset
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   false
 */
router.get('/compare', (req, res) => {
  
  var error = "";
  var word = "";
  var match1 = false;
  var match2 = false;
  
  if (!req.query.word1 || !req.query.word2){
    res.status(400).send(false);
    return
  }
    
  word1 = req.query.word1.toLowerCase();
  word2 = req.query.word2.toLowerCase();

  error = validateInput(word1)

  if (error == "OK"){
    error = validateInput(word2)
  }

  if (error != "OK"){
    res.status(400).send(error);
    return
  }

  if (word1 == word2){
    res.status(400).send("words should not be equal");
    return
  }

  if ((word1.length == word2.length) && (word1 != word2)) {
    
    if (hasPattern(word1, word2) == false){
      res.status(200).send(false);
      return
    } else {
      
      for (var i = 0; i<wordList.length; i++){
        word = wordList[i];

        if (word == word1) {
          match1 = true;
          continue;
        }
      
        if (word == word2) {
          match2 = true;
          continue;
        }

        if (match1 == true && match2 == true){
          res.status(200).send(true);
          return;
        }

      }

      if (match1 == false || match2 == false){
        res.status(200).send(false);
        return;
      }

		}

  } else {
    res.status(200).send(false);
  }

});

module.exports = router;