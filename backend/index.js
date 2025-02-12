import express from "express"
import mongoose from "mongoose"
import dotevn from "dotenv"
import cookieParser from "cookie-parser"


dotevn.config()
mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("Connted to mangoDB")
})
.catch((err)=> {
    console.log(err)
})

const app = express()

//to make input as json
app.use(express.json())
app.use(cookieParser)
app.use(cors({origin: "*"}))

app.listen(3000, ()=> {
    console.log("Server is ruuning on PORT 3000")
})

//import routes
import authRouter from "./routes/auth.route.js"

app.use("/api/auth", authRouter)



//error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})