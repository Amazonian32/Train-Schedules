$(document).ready(function () {
    var trainName;
    var destination;
    var firstTime;
    var newFreq;
    // ------------------
    var firebaseConfig = {
        apiKey: "AIzaSyCVT2xt-zuCt34AaCQfz5nzIvTv0s0Lgb8",
        authDomain: "trainscheduler-19cec.firebaseapp.com",
        databaseURL: "https://trainscheduler-19cec.firebaseio.com",
        projectId: "trainscheduler-19cec",
        storageBucket: "trainscheduler-19cec.appspot.com",
        messagingSenderId: "804173901454",
        appId: "1:804173901454:web:6ecb2e5cb12549b4c823df"
    };
    /* // Initialize Firebase */
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    $("#pushNewTrain").on("click", function (event) {
        event.preventDefault();
        console.log("IT IS CLICKING");
        trainName = $("#trainName").val().trim();
        destination = $("#destination2").val().trim();
        firstTime = $("#firstTime").val().trim();
        newFreq = $("#newFreq2").val().trim();
        var tFrequency = newFreq;

        // ----------------------------------------
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        var nextStop = moment(nextTrain).format("hh:mm")
        // -----------------------------------------
        // Add to firebase
        database.ref().push({
            trainData: {
                trainName: trainName,
                destination: destination,
                frequency: newFreq,
                nextTrain: nextStop,
                minutesTillTrain: tMinutesTillTrain,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }
        })
        // ------------------------------------
        var newRow = $("<tr>")
        var rowHeader = $("<th>").attr("scope", "row")
        rowHeader.text(trainName);
        var newData1 = $("<td>")
        newData1.text(destination)
        var newData2 = $("<td>")
        newData2.text(newFreq)
        var newData3 = $("<td>")
        newData3.text(nextStop)
        var newData4 = $("<td>")
        newData4.text(tMinutesTillTrain)

        // code for putting data in the table
        newRow.append(rowHeader, newData1, newData2, newData3, newData4)

        // appending to the table
        $("#trainTable").append(newRow)

    })
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });



})
