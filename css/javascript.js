$(document).ready(function(){

    var config = {
        apiKey: "AIzaSyBzjVg4xIUIiv25Kxd4i2SQXQlKW8Ukw-0",
        authDomain: "employeedatabase-7eb23.firebaseapp.com",
        databaseURL: "https://employeedatabase-7eb23.firebaseio.com",
        projectId: "employeedatabase-7eb23",
        storageBucket: "",
        messagingSenderId: "59311237449"
      };
    firebase.initializeApp(config);
    
    var database = firebase.database();
    
    // adding train function
    $("#submit").on("click", function() {
    
    //variable values
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var time = $('#timeInput').val().trim();
        var freq = $('#freqInput').val().trim();
    
    // push to firebase
        database.ref().push({
            name: name,
            dest: dest,
            time: time,
            freq: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        
        $("input").val('');
        return false;
    });
    
    //record snapshots
    database.ref().on("child_added", function(childSnapshot){
        
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().freq;
    
        console.log("Name: " + name);
        console.log("Destination: " + dest);
        console.log("Time: " + time);
        console.log("Frequency: " + freq);
        
    
        //number manipulation to find next arrival time and minutes away
        var freq = parseInt(freq);
        
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment().format('HH:mm'));
    
        var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
        console.log("DATE CONVERTED: " + dConverted);
    
        var trainTime = moment(dConverted).format('HH:mm');
        console.log("TRAIN TIME : " + trainTime);
        
        
        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);
        
        var tRemainder = tDifference % freq;
        console.log("TIME REMAINING: " + tRemainder);
        
        var minsAway = freq - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
        
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
        
    
     //This will append the data to the table
    $('#currentTime').text(currentTime);
    $('#trainTable').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
            "</td><td id='destDisplay'>" + childSnapshot.val().dest +
            "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
     },
    
    //alerts user to improper input
    function(errorObject){
        console.log("Read failed: " + errorObject.code)
    });
    
    database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
        // Changes the HTML
        $("#nameDisplay").html(snapshot.val().name);
        $("#destDisplay").html(snapshot.val().dest);
        $("#timeDisplay").html(snapshot.val().time);
        $("#freqDisplay").html(snapshot.val().freq);
    })
    
    });