import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan" ;
import path from "path" ;
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./Controllers/auth.js";
import { verifyToken } from "./Middleware/auth.js";
import { createPost } from "./Controllers/posts.js"

/* CONFIGURATION -> As we have used type:module so we have to
the below thing so that we can use directory name or we can invoke them*/
const __filename = fileURLToPath(import.meta.url); //gives u the current file.
const __dirname = path.dirname(__filename);        //sives u the folder where the current file is.
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" , extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}));
app.use(cors());
app.use("/assets" , express.static(path.join(__dirname , 'public/assets')));
//path => C:\Users\HP\OneDrive\Desktop\MERN_Sociopedia\server\public\assets

/*FILE STORAGE*/
const storage = multer.diskStorage(
    {
        destination: function (req , file , cb)
        {
            cb(null , "public/assets");
        },
        filename: function (req , file , cb)
        {
            cb(null , file.originalname);
        }
    }
);
//any time we need to upload a file we will call upload
const upload = multer({storage});
const port = process.env.PORT ;
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(port , () => console.log(`Server Port : ${port}`));
})
.catch((error) => console.log(`${error} did not connect`));

//Routes with files
app.post("/auth/register" , upload.single("picture")  , register);
app.post("/posts" , verifyToken , upload.single("picture") , createPost);


//Routes
app.use("/auth" , authRoutes);
app.use("/users" , userRoutes);
app.use("/post" , postRoutes);