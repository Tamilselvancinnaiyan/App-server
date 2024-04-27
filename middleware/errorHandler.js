const{constants}=require ("../constant");


const errorHandler =(err, req, res, next ) => {
    const  statusCode =  res.statusCode ? res.statusCode: 500;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ tittle:"Validation failded",message: err.message, stackTrace: err.stack });
            break;
    
        case constants.NOT_FOUND:
            res.json({ tittle:"not found",message: err.message, stackTrace: err.stack });
            break;
        
        case constants.UNAUTHORIZED:
            res.json({ tittle:"UNAUTHORIZED",message: err.message, stackTrace: err.stack });
            break;
                
        case constants.NOT_FOUND:
          res.json({ tittle:"NOT FOUND",message: err.message, stackTrace: err.stack });   
          break;
    
        default:
            console.log("no error found");
            break;
        
    }
    
    
};

module.exports= errorHandler;