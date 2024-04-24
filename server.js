const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Eventtrackers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a schema for Registration information
const enrollSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  eventname: { type: String, required: true },
  address:{ type: String, required: true },
});

// Create a model for registration information
const Enroll = mongoose.model('enrolls', enrollSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Create a schema for signup information
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  account: { type: String, required: true },
});

// Create a model for signup information
const signup = mongoose.model('signupstore', userSchema);

//Create a schema for Events information
const eventSchema = new mongoose.Schema({
  address: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  eventname: { type: String, required: true },
  description : { type: String, required: true },
  email : { type: String, required: true },
});

// Create a model for event information
const Event = mongoose.model('eventstore', eventSchema);

// Define the schema for the "geofences" collection
const geofenceSchema = new mongoose.Schema({
  coordinates: {
    type: [Number], // Array of numbers [latitude, longitude]
    required: true,
  },
  radius:{type: Number, required: true},
  address:{type: String, required: true}
});

// Create a model based on the schema for storing the location
const Geofence = mongoose.model('Geofence', geofenceSchema);

//Define the schema for the "Location" collection of Attendee
const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  email:{ type:String, required:true },
  insideGeofence: { type: Boolean, default: false },
});
//Create a model based on the schema for storing the location for attendee
const Location = mongoose.model('Location', locationSchema);

//Handle  POST request-location.js to mongodb
app.post('/saveCoordinates', async (req, res) => {
  const { coordinates,radius ,address} = req.body;

  try {
    // Create a new instance of the Geofence model
    const geofence = new Geofence({ coordinates ,radius,address});

    // Save the geofence document to MongoDB
    const savedGeofence = await geofence.save();

    res.status(200).send('Coordinates saved successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to save coordinates');
  }
});

// GET /geofences - Retrieve all geofences and display to event list-mongodb to Event.js
app.get('/geofences', async (req, res) => {
  try {
    const geofences = await Geofence.find();
    res.json(geofences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving geofences' });
  }
});

// Handle registration POST request-Registration.js to mongodb
app.post('/enroll', async (req, res) => {
  try {
    const { email, name, eventname ,address} = req.body;
    const enroll = new Enroll({ email, name, eventname ,address});
    await enroll.save();
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.status(400).json({ success: false, message: 'This registration data is already saved.' });
    } else {
      res.status(500).json({ success: false, message: 'Server error.' ,err});
    }
  }
});

// Handle signup POST request-Signup.js to mongodb
app.post('/signup', async (req, res) => {
  try {
    const { account, email, password } = req.body;

    // Create a new user
    const user = new signup({ account, email, password });

    // Save the user to the database
    await user.save();
    res.json({ success: true });
  } /*catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }*/
  catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.status(400).json({ success: false, message: 'This signup data is already saved.' });
    } else {
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
});

//Handle login POST request and checking the details with signup stored details-Login.js to server.js
app.post('/login', async (req, res) => {
  try {
    const { email, password ,account } = req.body;

    // Find the user in the database
    const user = await signup.findOne({ email, password ,account  });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (user.password !== password) {
      res.status(400).json({ success: false, message: 'Invalid  password.' });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

//Handle login POST request and checking the details of scanned qrcode with  stored details in enrolls collection-Scanqrcode.js to server.js
app.post('/verifyqrcode', async (req, res) => {
  try {
    const { email, name, eventname, address } = req.body;
    console.log('Received request with body:', req.body);

    // Perform a database query to check if the QR code data exists in the collection
    const enrollment = await Enroll.find({
      email: email,
      name: name,
      eventname: eventname,
      address: address,
    });

    console.log('Query:', {
      email: email,
      name: name,
      eventname: eventname,
      address: address,
    });
    if (enrollment) {
      console.log('QR code data found in the collection:', enrollment);
      res.json({ message: 'QR code data found', enrollment });

    } 
    else {
      console.log('QR code data not found in the collection', enrollment);
      const notFoundMessage = `No matching data found for email: ${email}, name: ${name}, eventname: ${eventname}, address: ${address}.`;
      res.status(404).json({ message: 'QR code data not found', detail: notFoundMessage });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Retrieve event information-mongodb to Event.js
app.get('/events', async (req, res) => {
  try {
    const result = await Event.find({});
    res.json(result);
  } catch (error) {
    console.error('Error retrieving the event  data:', error);
    res.status(500).json({ message: 'Failed to retrieve data' });
  }
});

//Retrieve event information-mongodb to HostEvents.js
app.get('/hostevents', async (req, res) => {
  try {
    const { email } = req.query;
    const result = await Event.find({ email });
    res.json(result);
  } catch (error) {
    console.error('Error retrieving the event data:', error);
    res.status(500).json({ message: 'Failed to retrieve data' });
  }
});


//Retrieve event information of particular id-mongodb to UpdateEvents.js
app.get('/hostevents/:id', async (req, res) => {
  try {
    const result = await Event.find({});
    res.json(result);
  } catch (error) {
    console.error('Error retrieving the event  data:', error);
    res.status(500).json({ message: 'Failed to retrieve data' });
  }
});


//Create a schema for email and qrcode information
const qrCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  qrCodeImage: { type: String, required: true },
});

// Create a model for qrcode information
const QRCodeData = mongoose.model('QRCodeData', qrCodeSchema);

// retrieve the information from "Enroll" collection-mongodb to qrcode.js
app.get('/retrieve', async (req, res) => {
  try {
    const result = await Enroll.find({});
    res.json(result);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ message: 'Failed to retrieve data' });
  }
});

// saving QRCode and Email in "QRCodeData" collection-qrcode.js to mondodb
app.post('/saveqrcode', async (req, res) => {
  try {
    const { email, name, eventName , address } = req.body;

    const existingQRCodeData = await QRCodeData.findOne({ email });
    if (existingQRCodeData) {
      return res.status(400).json({ message: 'QR code and email data already exist' });
    }

    const qrCodeValue = `${email}, ${name}, ${eventName}, ${address}`; //here the four attributes in registration list are stored in qrcodevalue
    const qrCodeImage = await qrcode.toDataURL(qrCodeValue); //the qrcodevalue is converted as qrcode and into a string
    const qrCodeData = new QRCodeData({ email, qrCodeImage });
    await qrCodeData.save();

    res.status(200).json({ message: 'QR code and email data saved' });
  } catch (error) {
    console.error('Error saving QR code and email data:', error);
    res.status(500).json({ message: 'Failed to save QR code and email data' });
  }
});

// sending QRCode to the retrieved email-qrcode.js to server to real time email
app.post('/sendqrcodeemail', async (req, res) => {
  try {
    const { email } = req.body;

    const qrCodeData = await QRCodeData.findOne({ email });
    if (!qrCodeData) {
      return res.status(400).json({ message: 'QR code data not found' });
    }

    const qrCodeImage = qrCodeData.qrCodeImage;

    // Configure your email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vvrvuppuluri@gmail.com',
        pass: 'ywlofhhiyjtzudkr',
      },
    });

    // Compose email message
    const mailOptions = {
      from: 'vvrvuppuluri@gmail.com',
      to: email,
      subject: 'QR Code',
      html: `<p>Here is your QR code invitation:</p>`, //converting the QRCode from string to Image
      //Converting the QRCode Image into file attachment
      attachments: [
        {
          filename: 'qrcode.png',
          path: qrCodeImage,
          cid: 'qrcode_image',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending QR code email:', error);
    res.status(500).json({ message: 'Failed to send QR code email' });
  }
});

// Handle creating events POST request-CreateEvents.js to mongodb
app.post('/createevents', async (req, res) => {
  try {
    const { address, date, eventname, time , description, email } = req.body;
    const event = new Event({address, date, eventname, time , description, email });
    await event.save();
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.status(400).json({ success: false, message: 'The event is created and saved.' });
    } else {
      res.status(500).json({ success: false, message: 'Server error.' ,err});
    }
  }
});

// Define the route for updating an event-UpdateEvents.js to mongodb
app.put('/hostevents/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = req.body;

    // Find the event in the database and update its details
    const event = await Event.findByIdAndUpdate(eventId, updatedEvent, { new: true });

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE route handler for deleting an event-HostEvents.js to mongodb
app.delete('/hostevents/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    // Implement your code to delete the event from the MongoDB database using the eventId
    await Event.findByIdAndDelete(eventId);
    res.sendStatus(200); // Sending 200 status code indicates successful deletion
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // Sending 500 status code indicates an error occurred
  }
});

// handle a post request of Attendee location-Event.js to mongodb
app.post('/locations', async (req, res) => {
  try {
    const { email ,latitude, longitude,insideGeofence } = req.body;
    const location = new Location({ email, latitude, longitude, insideGeofence });
    await location.save();
    res.json(location); // Respond with the location object including _id
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error storing location' });
  }
});

// PUT /locations/:id - Update an existing location-Event.js to mongodb-automatically without clicking a button
app.put('/locations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, insideGeofence } = req.body; // Include the isInside field

    // Update the location document with the provided latitude, longitude, and isInside
    const location = await Location.findByIdAndUpdate(
      id,
      { latitude, longitude, insideGeofence },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating location' });
  }
});

// GET /geofences - Retrieve all locations and display to Tracking-mongodb to locationtracking.js
app.get('/tracking', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving geofences' });
  }
});


//start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

