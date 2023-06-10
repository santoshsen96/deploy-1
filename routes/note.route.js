const express=require("express")
const {NoteModel}=require("../model/note.model")
const {auth}=require("../middleware/auth.middleware")

const noteRouter=express.Router()
noteRouter.use(auth)

noteRouter.post("/create",async(req,res)=>{
    try{
        const note=new NoteModel(req.body)
        await note.save()
        res.json({msg:"new note added",note:req.body})
    }catch(err){
        res.json({error:err.message})
    }
})

noteRouter.get("/",async(req,res)=>{
    try{
        const notes=await NoteModel.find({userID:req.body.userID})
        res.send(notes)
    }catch(err){
        res.json({error:err.message})
    }
})

noteRouter.patch("/update/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID} = req.params
    try{
        const note=await NoteModel.findOne({_id:noteID})
        const userIDinNoteDoc=note.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await NoteModel.findByIdAndUpdate({_id:noteID},req.body)
            res.json({msg:`${note.title} has updated`})
        }else{
            res.json({msg:"Not authorized"})
        }

    }catch(err){
        res.json({error:err})
    }
    
})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID} = req.params
    try{
        const note=await NoteModel.findOne({_id:noteID})
        const userIDinNoteDoc=note.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.json({msg:`${note.title} has deleted`})
        }else{
            res.json({msg:"Not authorized"})
        }

    }catch(err){
        res.json({error:err})
    }
})

module.exports={
    noteRouter
}