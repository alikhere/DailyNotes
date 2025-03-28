import express from "express"
import mongoose from "mongoose"
import dotevn from "dotenv"
import cookieParser from "cookie-parser"
import  cors from "cors"


dotevn.config()
mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("Connted to mangoDB")
})
.catch((err)=> {
    console.log(err)
})

const app = express()
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

//to make input as json
app.use(express.json())
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true}))
app.listen(PORT, ()=> {
    console.log("Server is ruuning on PORT 3000")
})

//import routes
import authRouter from "./routes/auth.route.js"
import noteRouter from "./routes/note.route.js"


app.use("/api/auth", authRouter)
app.use("/api/note", noteRouter)



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