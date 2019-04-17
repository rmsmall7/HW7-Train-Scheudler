//this js file will store most of the page functions

// doc ready:   **  did not need this ** 
//time is displayed in header  *done**
// the train scheudle body is ready **done**
//first time to load the body will not have info  **done**
//add train section will be blank and user will be able to add in their train  *done**



      // Initialize Firebase -  copied this from firebase after creating the db
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

      //setting the var for the current time in the header of the html -  using moment.js for this
      setInterval(function (startTime) {
        $("#timer").html(moment().format('hh:mm a'))
      }, 1000);

      //get info from the form / make an object to put the info -  The vars I created are getting the input from the form on the html after the user selects the submit button
      $("#addTrainBtn").on("click", function() {
        var trainName = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
        var frequency = $("#frequencyInput").val().trim();

        //console.log to make sure the train info is submitting when submit is selected -  commented this out after checking to make sure it was working.  Keeping it as I can use it later if debugging is needed
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

        //code to push the user entered data to firebase and will store it in the newTrain format for use later
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
    
      //this is getting a snapshot of the information the user has added.  Will append this information later in the html
      trainData.ref().on("child_added", function(snapshot) {
        var name= snapshot.val().name;
        var destination = snapshot.val().destination;
        var frequency = snapshot.val().frequency;
        var firstTrain = snapshot.val().firstTrain;

        //using moment.js to figure out time until next train--  creating new variables to calculate the time until next train
        var remainder = moment().diff(moment.unix(firstTrain),"minutes")%frequency;
        var minutes = frequency - remainder;
        var arrival = moment().add(minutes,"m").format("hh:mm A");

        //console log to check to make sure these are calculating correctly.  Keeping this to use later for debugging if needed
        // console.log(remainder);
        // console.log(minutes);
        // console.log(arrival);

        //this is the code to append the data to the HMTL and to create a new row for each entry
        $("#trainTable > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td><td>");

      })
        
      

    

