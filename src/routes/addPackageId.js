import { Router } from "express";


const router = Router();

router.post('/',async (req,res) => {
    const packageId = req.packageData;
    
    res.status(201).json({ message: 'package successfully added to the database' });
})

export default router;