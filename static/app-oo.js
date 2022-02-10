class Game{
    constructor(){
    this.score = 0
    this.gameOver = false
    this.timer = 5
    this.scoredWord = new Set()
    this.clock = setInterval(this.timekeeper.bind(this), 1000)
    }

async handleSubmit (e){
    e.preventDefault();
    let $guess = $("#guess")
    let guess = $guess.val()
    
    if(this.gameOver == true){
            this.printMessage("Game Over")
            clearTimeout()
            return
        }
    
    if (!guess) return
        
    if (this.scoredWord.has(guess)){
            this.printMessage("This has been scored")
            return
        }
    
    let validity = await this.isWord(guess)
    if (validity==="not-word"){
            this.printMessage("This is not a valid word")
        }
    else if (validity==="not-on-board"){
            this.printMessage("This word is not on the board")
        }
    else if (validity==="ok"){
            this.printMessage("Valid Word")
            this.addScore(guess)
            this.recordWords(guess)
        }
    }
    
    async isWord(word){
        let res = await axios.get("/is-word", {params: {word:word}})
        let validity =res.data.result
        
       return validity
    
    }

    printMessage(msg){
        const $msgs = $("#msgs")
        $msgs.empty()
        $msgs.append(`<p class="msg">${msg}</p>`)
    }

    addScore(word){
        const $score= $("#score")
        points = word.length
        this.score = this.score+points
        $score.text(this.score)
    }

    async endGame(){
        this.gameOver = true
        res= await axios.post(
            `/game-over`,{score:this.score}
        )
        plays=res.data.games
        if(res.data.brokerecord === true){
            this.printMessage(`New High Score! You've played ${plays} times`)
        }
        if(res.data.brokerecord === false)
            this.printMessage(`You've played ${plays} times`)
    }

    timekeeper(){
        const $timer = $("#timer")
        this.timer--
        $timer.text(this.timer)
        if (this.timer == -1){
            clearTimeout(this.clock)
            this.endGame()
        }
    }

    recordWords(word){
        const $scoredWords = $("#wordlist")
        this.scoredWord.add(word)
        $scoredWords.append(`<li>${word}</li>`)
    }
}