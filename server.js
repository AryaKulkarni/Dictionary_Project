const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const https=require("https")



const app=express()



app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + '/public'));

app.get("/",function (req,res) {
    res.render("dictionary",{wordEntered:"",
    wordPhonetics:"",
wordMeanings:[]})
})

app.post("/",function(req,res) {
    const wordEntered=req.body.wordEntered
    if(wordEntered) {
    const url=`https://api.dictionaryapi.dev/api/v2/entries/en/${wordEntered}`
    console.log(url)

    let wordPhonetics,wordMeanings,wordSynonyms,wordAntonyms

    https.get(url,function(response) {
        response.on("data",function(data) {
            if(JSON.parse(data)[0]) {
            const wordData=JSON.parse(data)
            wordPhonetics=wordData[0].phonetics[0].text
            console.log(wordPhonetics)


            wordMeanings=wordData[0].meanings
            console.log(wordMeanings)





            res.render("dictionary",{wordEntered:wordEntered,
                wordPhonetics:wordPhonetics,
            wordMeanings:wordMeanings})
            }
            else {
                res.redirect("/")
                console.log("Entered Word does not exist. Please try again.")
            }
        })
    })
}
else {
    res.redirect("/")
    console.log("Nothing inputted.")
}




})


app.listen(3000,()=> console.log("Server Started"))