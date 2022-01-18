const app = require("./index")

const port = process.env.PORT || 2001;
const connection = require("./Configs/db")

app.listen(port, async ()=> {
    try {
        console.log(`Running on Port ${port}`)
        await connection()
    } catch (error) {
        console.log(error.message)
    }
})