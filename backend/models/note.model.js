import mangoose from "mongoose"

const noteSchema = new mangoose.Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    tags: {
        type: [String],
        default: []
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
})

const Note = mangoose.model("Note", noteSchema)
export default Note;