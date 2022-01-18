const app = require("./index")

const Port = process.env.PORT || 2001;
const connection = require("./Configs/db")

app.listen(Port, async ()=> {
    try {
        console.log(`Running on Port ${Port}`)
        await connection()
    } catch (error) {
        console.log(error.message)
    }
})