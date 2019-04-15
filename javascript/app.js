//this js file will store most of the page functions

// doc ready:   **  did not need this ** 
//time is displayed in header  *done**
// the train scheudle body is ready **done**
//first time to load the body will not have info  **done**
//add train section will be blank and user will be able to add in their train  *done**



      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDS4BM4oQwdfiRwnQ4qf_BwYfqbrbK8DiI",
        authDomain: "train-scheduler-efa77.firebaseapp.com",
        databaseURL: "https://train-scheduler-efa77.firebaseio.com",
        projectId: "train-scheduler-efa77",
        storageBucket: "train-scheduler-efa77.appspot.com",
        messagingSenderId: "122927562185"
      };
      firebase.initializeApp(config);

      //this will give access to the db
      var trainData = firebase.database();

      //setting the var for the current time in the header of the html
      setInterval(function (startTime) {
        $("#timer").html(moment().format('hh:mm a'))
      }, 1000);

      //get info from the form / make an object to put the info
      $("#addTrainBtn").on("click", function() {
        var trainName = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
        var frequency = $("#frequencyInput").val().trim();

        //console.log to make sure the train info is submitting when submit is selected
        // console.log(trainName);
        // console.log(destination);
        // console.log(firstTrain);
        // console.log(frequency);
        // return false;
        
        //This is the var that will store the user input information
        var newTrain = {
          name: trainName,
          destination: destination,
          firstTrain: firstTrain,
          frequency: frequency
        }

        //code to push the user entered data to firebase
        trainData.ref().push(newTrain);

        //simple alert for the user to know that they did add a train successfully
        alert("Train has been added!");

        //code to clear the users' input after clicking the submit button.  so they are ready to add another train
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#firstTrainInput").val("");
        $("#frequencyInput").val("");

        return false;        
      })   

      trainData.ref().on("child_added", function(snapshot) {
        var name= snapshot.val().name;
        var destination = snapshot.val().destination;
        var frequency = snapshot.val().frequency;
        var firstTrain = snapshot.val().firstTrain;

        //using moment.js to figure out time until next train
        var remainder = moment().diff(moment.unix(firstTrain),"minutes")%frequency;
        var minutes = frequency - remainder;
        var arrival = moment().add(minutes,"m").format("hh:mm A");

        //console log to check to make sure these are calculating correctly
        // console.log(remainder);
        // console.log(minutes);
        // console.log(arrival);

        //this is the code to append the data to the HMTL and to create a new row for each entry
        $("#trainTable > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td><td>");

      })
        
      

    

