import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize'; 
import xss from 'xss-clean'; 

//initialise express app
const app = express();

await connectDB();

//Middleware
app.use(cors());

app.use(helmet());

app.use(express.json());

// Data sanitization middleware
app.use(mongoSanitize({ replaceWith: '_' }));// Sanitizes against NoSQL query injection
app.use(xss()); // Sanitizes against cross-site scripting (XSS)

// Apply a general rate limit to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);



app.get('/', (req, res)=>{
    res.send("Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Sever Running On Port ${PORT}`);
})
