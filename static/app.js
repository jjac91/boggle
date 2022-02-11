let score = 0
let gameOver = false
let timer = 60
let scoredWord = new Set()
$("#guess-form").on("submit", async function handleSubmit (e){
    e.preventDefault();
    if(gameOver == true){
        printMessage("Game Over")
        clearTimeout()
        return
    }
    let guess = $("#guess").val()
    if (!guess) return
    
    if (scoredWord.has(guess)){
        printMessage("This has been scored")
        return
    }

    let validity = await isWord(guess)
    if (validity==="not-word"){
        printMessage("This is not a valid word")
    }
    else if (validity==="not-on-board"){
        printMessage("This word is not on the board")
    }
    else if (validity==="ok"){
        printMessage("Valid Word")
        addScore(guess)
        recordWords(guess)
    }
}
)

async function isWord(word){
    let res = await axios.get("/is-word", {params: {word:word}})
    let validity =res.data.result
    
   return validity

}
function printMessage(msg){
    const $msgs = $("#msgs")
    $msgs.empty()
    $msgs.append(`<p class="msg">${msg}</p>`)
    console.log(msg)
}

function addScore(word){
    const $score= $("#score")
    let points = word.length
    score = score+points
    $score.text(score)
    console.log(score)
}

async function endGame(){
    gameOver = true
    let res= await axios.post(
        `/game-over`,{score:score}
    )
    let plays=res.data.games
    if(res.data.brokerecord === true){
        printMessage(`New High Score! You've played ${plays} times`)
    }
    if(res.data.brokerecord === false)
        printMessage(`You've played ${plays} times`)
}

function timekeeper(){
    const $timer = $("#timer")
    if (timer == -1){
        clearTimeout(clock)
        endGame()
    }
    else{
        timer--
        $timer.text(timer)
    }
}
function recordWords(word){
    const $scoredWords = $("#wordlist")
    scoredWord.add(word)
    $scoredWords.append(`<li>${word}</li>`)
}
let clock = setInterval(timekeeper, 1000)