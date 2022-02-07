$("#guess-form").on("submit", async function handleSubmit (e){
    e.preventDefault();
    
    let guess = $("#guess").val()
    if (!guess) return
    console.log(guess)
    printMessage(guess)

    let validity = await isWord(guess)
    console.log(validity)
    
    if (validity==="ok"){
        printMessage("Valid Word")
    }
    if (validity==="not-on-board"){
        printMessage("This word is not on the board")
    }
    if (validity==="not-a-word"){
        printMessage("This is not a valid word")
    }
}
)

async function isWord(word){
    let res = await axios.get("/is-word", {params: {word:word}})
    let validity =res.data.result
    
   return validity

}
function printMessage(msg){
    const $msgs = $("msgs")
    $msgs.empty()
    $msgs.append(msg)
    console.log(msg)
}