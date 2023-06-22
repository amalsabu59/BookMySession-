import express, { Request, Response, Router } from 'express';
import Session, { ISession } from '../models/Session';
import session, { SessionData } from 'express-session';


const router: Router = express.Router();
interface CustomSessionData extends SessionData {
    bearerToken?: string;
  }

const sessionsData = [
    {
      date: '2023-06-22',
      time: '10:00 AM',
    },
    {
      date: '2023-06-23',
      time: '10:00 AM',
    },
  ];


router.get('/insertSession', (req: Request, res: Response) => {

    Session.insertMany(sessionsData)
    .then(() => {
      res.send('Sessions added successfully to the master table.');
    })
    .catch((error) => {
      res.send(error);
    });
  
  });


  
router.get('/all-sessions', async (req: Request, res: Response) => {
try {
  if(!req.headers.authorization){
   return  res.status(403).json({message: 'Access Denied: Auth Token Required'})
  }
  const authToken = req.headers.authorization.split(' ')[1]

  const sessionToken = (req.session as CustomSessionData).bearerToken;
  if(authToken !== sessionToken){
    return  res.status(403).json({message: 'Access Denied: Auth Token Expiered or not valid'})
  }
  console.log(req.headers.authorization.split(' ')[1]);
  const  sessions = await Session.find()
  res.status(200).json({sessions})
} catch (error) {
  return  res.status(500).json({message: error})
  
}
});

module.exports = router;
