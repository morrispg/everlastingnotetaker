const express = require('express');
const htmlRoute = require('./routes/htmlRoutes')
const apiRoute = require('./routes/apiRoutes')

const app = express()

const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use("/",htmlRoute)
app.use("/api", apiRoute)
app.listen(PORT, ()=> console.log(`listening on PORT ${PORT}`))
