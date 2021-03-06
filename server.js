const express = require( 'express' )
const { Router } = require( 'express' );
const bodyParser = require( 'body-parser' );
const Sequelize = require( 'sequelize' );
const { hashPassword, genToken, checkPassword } = require( './backend/auth' );
const giverRouter = Router();
const app = express()

const { Seeker, Giver, Message, Request, Review, Skill } = require( './backend/models' );
const PORT = process.env.PORT || 1234

const Op= Sequelize.Op;

const cors = require( 'cors' )
app.use( cors() )



app.use( "/", express.static( "./build/" ) );
app.use( bodyParser.json() )
app.use( ( e, req, res, next ) => {
    if ( e ) {
        console.log( e );
        res.status( 500 ).send( e.message )
    }
} )



// app.get( '/seeker/browse', async ( req, res ) => {
//     try {
//         const givers = await Giver.findAll( { raw: true } )
//         res.json( {
//             givers
//         } )
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         } )
//     }
// } )



// app.get( '/messages', async ( req, res ) => {
//     try {
//         const messages = await Message.findAll( { raw: true } )
//         res.json( {
//             messages
//         } )
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         } )
//     }
// } )



app.get('/seeker/search/:description', async(req,res)=>{
    try{
        const skill = await Skill.findOne({
            where:{
                description:{
                    [Op.iLike]: `%${req.params.description}%`
                }
            }
        })
        const givers = await skill.getGivers()
        res.json({...skill.get(),givers})
    }catch(e){
        res.json( { message: e.message } )
    }
})

app.get('/seeker/all', async(req,res)=>{
    try{
        const givers = await Giver.findAll()
        res.json(givers)
    }catch(e){
        res.json( { message: e.message } )
    }
})



app.delete('/request/delete/:id', async(req,res)=>{
    try{
        await Request.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json({message:"Success"})
    }catch(e){
        res.json( { message: e.message } )
    }
})


app.put('/seeker/update/:id', async (req, res) => {
    try {
      const id = req.params.id
      console.log("*****"+id)
      const updateSeeker = {
        name: req.body.name,
        email: req.body.email,
        description: req.body.description
      };
      const seeker = await Seeker.update(updateSeeker, { where: {id: id} })
      res.json(seeker)
    } catch(e) {
      console.error(e)
      res.status(500).json({message: e.message})
    }
  })


  app.put('/giver/update/:id', async (req, res) => {
    try {
      const id = req.params.id
      console.log("*****"+id)
      const updateGiver = {
        name: req.body.name,
        email: req.body.email,
        description: req.body.description
      };
      const giver = await Giver.update(updateGiver, { where: {id: id} })
      res.json(giver)
    } catch(e) {
      console.error(e)
      res.status(500).json({message: e.message})
    }
  })

app.post( '/seeker/request', async ( req, res ) => {        
    try{
        const request = await Request.create( {
            title: req.body.title,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            description: req.body.description,
            complete:0,
            approval:0
          })
          request.setGiver(req.body.giver_id)
          request.setSeeker(req.body.seeker_id)
        res.json( request );
    } catch ( e ) {
        res.json( { message: e.message } )
    }
})



app.get( '/seeker/status/:id', async ( req, res ) => {
    try {
        const requests = await Request.findAll( {
            where: {
                seeker_id: req.params.id
            }
        } )
        res.json({requests})
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        } )
    }
} )


app.post( '/giver', async ( req, res ) => {
    try {
        const giver = await Giver.findOne( {
            where: {
                email: req.body.email
            }
        } )
        res.json( giver )
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        } )
    }
} )

app.get( '/giver/status/:id', async ( req, res ) => {
    try {
        const requests = await Request.findAll( {
            where: {
                giver_id: req.params.id
            }
        } )
        res.json({requests})
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        } )
    }
} )



// app.get( '/seeker/:seekerid/search', async ( req, res ) => {
//     try {
//         const id = req.params.seekerid
//         const seeker = await Seeker.findByPk( id, { raw: true } )
//         if ( !seeker ) throw Error( 'seeker not found' )
//         res.json( seeker )
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         } )
//     }
// } )




// app.get( '/message/:seekerid', async ( req, res ) => {
//     try {
//         const id = req.params.seekerid
//         const message = await Message.findByPk( id, { raw: true } )
//         if ( !message ) throw Error( 'giver not found' )
//         res.json( message )
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         } )
//     }
// } )

// app.get( '/message/:giverid', async ( req, res ) => {
//     try {
//         const id = req.params.giverid
//         const message = await Message.findByPk( id, { raw: true } )
//         if ( !message ) throw Error( 'giver not found' )
//         res.json( message )
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         } )
//     }
// } )

// app.get( '/requests/:requestid', async ( req, res ) => {
//     try {
//         const id = req.params.requestid
//         const request = await Request.findByPk( id, { raw: true } )
//         if ( !request ) throw Error( 'giver not found' )
//         res.json( request )
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         } )
//     }
// } )

// app.post( 'seeker/registration', async ( req, res ) => {
//     console.log( req.body )
//     try {
//         const seeker = await Seeker.create( req.body )
//         res.json( seeker )
//     } catch ( e ) {
//         console.log( e )
//         res.status( 500 ).json( { message: e.message } )
//     }
// } )

// app.post( '/giver/registration', async ( req, res ) => {
//     console.log( req.body )
//     try {
//         const giver = await Giver.create( req.body )
//         res.json( giver )
//     } catch ( e ) {
//         console.log( e )
//         res.status( 500 ).json( { message: e.message } )
//     }
// } )



// app.post( '/messages', async ( req, res ) => {
//     console.log( req.body )
//     try {
//         const message = await Message.create( req.body )
//         res.json( message )
//     } catch ( e ) {
//         console.log( e )
//         res.status( 500 ).json( { message: e.message } )
//     }
// } )

app.post( '/seeker/status', async ( req, res ) => {
    try {
        const requests = await Request.findAll( {
            where: {
                seeker_id: req.body.id
            }
        } )
        res.json( {
            requests
        } )
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        } )
    }
} )


app.post( '/giver/status', async ( req, res ) => {
    try {
        const requests = await Request.findAll( {
            where: {
                giver_id: req.body.id
            }
        } )
        res.json( {
            requests
        } )
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        } )
    }
} )

app.post( '/seeker', async ( req, res ) => {
    try {
        const seeker = await Seeker.findOne( {
            where: {
                email: req.body.email
            }
        } )
        res.json(seeker)
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        } )
    }
} )

app.post( '/giver', async ( req, res ) => {
    try {
        const giver = await Giver.findOne( {
            where: {
                email: req.body.email
            }
        } )
        res.json(giver)
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        } )
    }
} )

// app.post( '/giver/status', async ( req, res ) => {
//     try {
//         const requests = await Request.findAll( {
//             where: {
//                 giver_id: req.body.id
//             }
//         } )
//         res.json(requests)
//     } catch ( e ) {
//         res.status( 500 ).json( {
//             message: e.message
//         } )
//     }
// } )


// data seeker just typed in
const buildAuthResponse = giver => {
    const token_data = {
        id: giver.id,
        email: giver.email
    }
    const jwt = genToken( token_data )
    return { jwt }
}



app.post('/giver/signin', async(req, res, next)=>{
    try{
        const giver = await Giver.findOne({
            where:{
                email:req.body.email
            }
        })
        if(await checkPassword(req.body.password, giver.password_digest) ){
            const respData = buildAuthResponse(giver);
            res.json({ ...respData, status:888 })
        }else{
            res.json({status:401});
        }
    }catch(e){
        res.json({message:e.message,status:233})
    }
})

app.post('/seeker/signin', async(req, res, next)=>{
    try{
        const seeker = await Seeker.findOne({
            where:{
                email:req.body.email
            }
        })
        if(await checkPassword(req.body.password, seeker.password_digest) ){
            const respData = buildAuthResponse(seeker);
            res.json({ ...respData, status:888 })
        }else{
            res.json({status:401});
        }
    } catch ( e ) {
        res.json( { message: e.message, status: 233 } )
    }
} )

app.post('/giver/registration', async(req, res, next)=>{
    try{
        const password_digest = await hashPassword(req.body.password)
        const giver = await Giver.create({
            rate: req.body.rate,
            gender: req.body.gender,
            age: req.body.age,
            name: req.body.name,
            email: req.body.email,
            description: req.body.description,
            picture_url: req.body.picture_url,
            password_digest
        } )
        const respData = buildAuthResponse( giver );
        res.json( respData);
    } catch ( e ) {
        res.json( { message: e.message } )
    }
})
app.post( '/seeker/registration', async ( req, res, next ) => {
    try {
        const password_digest = await hashPassword( req.body.password )
        const seeker = await Seeker.create( {
            name: req.body.name,
            email: req.body.email,
            description: req.body.description,
            picture_url: req.body.picture_url,
            password_digest
        })
        const respData = buildAuthResponse( seeker );
        res.json( respData );
    } catch ( e ) {
        res.json( { message: e.message } )
    }
} )

app.listen(PORT, () => {
    console.log(`Server up and listening on port ${PORT}, in ${app.get('env')} mode.`);
  })
