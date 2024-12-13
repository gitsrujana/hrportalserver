import  express from 'express'
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sequelize from './config/db.js'
import employeeRoutes from './routes/employeeRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1/api/employees', employeeRoutes);
app.use('/v1/api/leaveapplication',leaveRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT} `)
}
)