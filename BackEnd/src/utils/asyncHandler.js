const asyncHandler=(requireHandler)=>{
    return ( req,res,next)=>{
        Promise.resolve(requireHandler(req,res,next))
        .catch((err)=>next(err))
    }
}

export{asyncHandler}




//********************************OR|||||||||||||||||************************* */
/*
const asyncHandler=()=>{}
const asyncHandler=(function)=>{()=>{}}
const asyncHandler=(function)=>{async()=>{}}
********************OR********************
*/
// const asyncHandler=(function)=>async(req,res,next)=>{
//     try {
//         await function(req,res,next)
//     } catch (error) {
//         res.status(error.code|500).json({
//             success:false
//             message:error.message
//         })
//     }
// }