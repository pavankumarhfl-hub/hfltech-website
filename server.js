import express from "express";
import pg from "pg";
import helmet from "helmet";
import cors from "cors";
import crypto from "crypto";
const {Pool}=pg;
const app=express();
app.use(helmet({crossOriginResourcePolicy:false}));
app.use(cors({origin:["https://hfltech.in","https://www.hfltech.in"],methods:["GET","POST","PATCH"],allowedHeaders:["Content-Type","Authorization"]}));
app.use(express.json({limit:"32kb"}));
const pool=process.env.DATABASE_URL?new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}}):null;
const ADMIN_TOKEN=process.env.ADMIN_TOKEN||"";
const PORT=process.env.PORT||10000;
const areas=["Community","Education","Technology","Cybersecurity","Content & Media","Event & Operations","Research","Student Volunteer"];
const statuses=["New","Reviewing","Shortlisted","Accepted","Rejected"];
async function init(){if(!pool)return;await pool.query(`CREATE TABLE IF NOT EXISTS volunteer_applications(
id UUID PRIMARY KEY,
full_name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT,location TEXT NOT NULL,age_group TEXT NOT NULL,
background TEXT NOT NULL,volunteer_area TEXT NOT NULL,skills TEXT,education TEXT,experience TEXT,
availability TEXT,motivation TEXT NOT NULL,portfolio TEXT,additional_info TEXT,status TEXT NOT NULL DEFAULT 'New',
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`)}
function admin(req,res,next){if(!ADMIN_TOKEN||req.headers.authorization!==`Bearer ${ADMIN_TOKEN}`)return res.status(401).json({error:"Unauthorized"});next()}
app.get("/health",(req,res)=>res.json({ok:true,database:!!pool}));
app.post("/api/volunteers",async(req,res)=>{try{
 if(!pool)return res.status(503).json({error:"Application service is not connected to its database yet."});
 const b=req.body||{}; const required=["fullName","email","location","ageGroup","background","volunteerArea","motivation"];
 if(required.some(k=>typeof b[k]!=="string"||!b[k].trim()))return res.status(400).json({error:"Please complete all required fields."});
 if(!areas.includes(b.volunteerArea))return res.status(400).json({error:"Invalid volunteer area."});
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))return res.status(400).json({error:"Please provide a valid email address."});
 const id=crypto.randomUUID();
 await pool.query(`INSERT INTO volunteer_applications(id,full_name,email,phone,location,age_group,background,volunteer_area,skills,education,experience,availability,motivation,portfolio,additional_info) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,[id,b.fullName.trim(),b.email.trim(),b.phone||"",b.location.trim(),b.ageGroup,b.background,b.volunteerArea,b.skills||"",b.education||"",b.experience||"",b.availability||"",b.motivation.trim(),b.portfolio||"",b.additionalInfo||""]);
 res.status(201).json({ok:true,id});
}catch(e){console.error(e);res.status(500).json({error:"Application could not be submitted."})}});
app.get("/api/admin/volunteers",admin,async(req,res)=>{try{const q=req.query.status;const r=q&&statuses.includes(q)?await pool.query("SELECT * FROM volunteer_applications WHERE status=$1 ORDER BY created_at DESC",[q]):await pool.query("SELECT * FROM volunteer_applications ORDER BY created_at DESC");res.json(r.rows)}catch(e){res.status(500).json({error:"Could not load applications."})}});
app.patch("/api/admin/volunteers/:id",admin,async(req,res)=>{try{if(!statuses.includes(req.body.status))return res.status(400).json({error:"Invalid status."});const r=await pool.query("UPDATE volunteer_applications SET status=$1 WHERE id=$2 RETURNING *",[req.body.status,req.params.id]);if(!r.rowCount)return res.status(404).json({error:"Application not found."});res.json(r.rows[0])}catch(e){res.status(500).json({error:"Could not update application."})}});
init().then(()=>app.listen(PORT,()=>console.log(`HFL volunteer API listening on ${PORT}`))).catch(e=>{console.error(e);process.exit(1)});
