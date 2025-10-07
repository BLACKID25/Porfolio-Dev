// app/libs/mongodb.js
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

// Asegúrate de que tu URL de conexión a MongoDB esté definida en tus variables de entorno (.env.local)
const MONGODB_URI = process.env.DB_COMPASS;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DB_COMPASS environment variable inside .env.local'
  );
}


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Deshabilita el buffering de comandos
      // useNewUrlParser: true, // Ya es el valor por defecto en versiones recientes de Mongoose
      // useUnifiedTopology: true, // Ya es el valor por defecto en versiones recientes de Mongoose
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Mongoose is connected');
      console.log('######################');
      console.log('###### DB PORFOLIO ######');
      console.log('######################');
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;