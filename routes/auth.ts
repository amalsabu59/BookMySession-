import express, {Request,Response,Router} from 'express'
import User from '../models/user'
const { v4: uuidv4 } = require('uuid');
import session, { SessionData } from 'express-session';
const router:Router = express.Router()

interface CustomSessionData extends SessionData {
    bearerToken?: string;
  }

function generateToken() {
    const token = uuidv4();
    return token;
  }

router.post('/register',async(req:Request,res:Response) => {
    try{

        const newUser = new User({
            universityId:"DEAN123",
            password:"abc123",
            isDean:true,
        })

        const user = await newUser.save()
        res.status(200).send(user)
        
    }catch(err){

    console.log(err)
    }

})

router.post('/login',async(req:Request,res:Response) => {
    const token = generateToken()
    const {universityId,password} = req.body

    const user =   await User.findOne({universityId})
    if(!user)  return res.status(404).json("user not found")

    const isVaildPassword = user.password === password
    if(isVaildPassword){

    (req.session as CustomSessionData).bearerToken = token
    // const bearerToken = (req.session as CustomSessionData).bearerToken

    
    res.status(200).json({token})

}
})


module.exports = router;